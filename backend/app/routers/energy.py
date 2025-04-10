from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.models.user import User
from app.models.energy_data import EnergyData
from app.schemas.energy import EnergyDataResponse, EnergyStatsResponse, ApplianceData
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/api/energy",
    tags=["energy"]
)

@router.get("/data", response_model=List[EnergyDataResponse])
async def fetch_energy_data(
    timeframe: str = Query("month", enum=["today", "month", "year"]),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch energy data with flexible timeframe
    """
 
    now = datetime.now()
    if timeframe == "today":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif timeframe == "month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    else:  
        start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    

    raw_data = db.query(EnergyData).filter(
        EnergyData.user_id == current_user.id,
        EnergyData.timestamp >= start_date,
        EnergyData.timestamp <= now
    ).order_by(EnergyData.timestamp).all()
    

    processed_data = []
    

    grouped_data = {}
    for item in raw_data:
        timestamp_str = item.timestamp.strftime("%Y-%m-%d %H:%M")
        
        if timestamp_str not in grouped_data:
            grouped_data[timestamp_str] = {
                "timestamp": timestamp_str,
                "consumption": 0,
                "generation": {
                    "solar": 0,
                    "wind": 0,
                    "hydro": 0,
                    "total": 0
                },
                "carbonFootprint": 0,
                "costs": {
                    "electricity": 0,
                    "gas": 0,
                    "total": 0
                }
            }
        

        data_point = grouped_data[timestamp_str]
        data_point["consumption"] += item.consumption
        
        if item.energy_type == "solar":
            data_point["generation"]["solar"] += item.generation
        elif item.energy_type == "wind":
            data_point["generation"]["wind"] += item.generation
        elif item.energy_type == "hydro":
            data_point["generation"]["hydro"] += item.generation
        
        data_point["generation"]["total"] += item.generation
 
    for timestamp, data in grouped_data.items():
        consumption = data["consumption"]
        generation = data["generation"]["total"]

        data["carbonFootprint"] = max(0, consumption - generation) * 0.5

        electricity_cost = consumption * 0.15
        gas_cost = consumption * 0.05
        
        data["costs"] = {
            "electricity": electricity_cost,
            "gas": gas_cost,
            "total": electricity_cost + gas_cost
        }
        
        processed_data.append(data)
    
 
    processed_data.sort(key=lambda x: x["timestamp"])
    
    return processed_data

@router.get("/stats", response_model=EnergyStatsResponse)
async def get_energy_stats(
    timeframe: str = Query("month", enum=["today", "month", "year"]),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get aggregated energy statistics
    """

    energy_data = await fetch_energy_data(timeframe, db, current_user)
    

    stats = calculate_stats(energy_data)
    
    return stats

@router.get("/appliances", response_model=List[ApplianceData])
async def get_appliance_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get appliance-specific energy consumption data
    """

    return [
        {
            "id": "1",
            "name": "Heating & AC",
            "consumption": 1.4,
            "unit": "kWh"
        },
        {
            "id": "2",
            "name": "EV Charge",
            "consumption": 0.9,
            "unit": "kWh"
        },
        {
            "id": "3",
            "name": "Refrigerator",
            "consumption": 0.7,
            "unit": "kWh"
        },
        {
            "id": "4",
            "name": "Washer & Dryer",
            "consumption": 0.6,
            "unit": "kWh"
        },
        {
            "id": "5",
            "name": "Lighting",
            "consumption": 0.5,
            "unit": "kWh"
        },
        {
            "id": "6", 
            "name": "Other",
            "consumption": 0.3,
            "unit": "kWh"
        }
    ]

def calculate_stats(data: List[Dict]) -> Dict:
    """
    Calculate aggregate statistics from energy data
    """
    if not data:
        return {
            "totalConsumption": 0,
            "totalGeneration": {
                "solar": 0,
                "wind": 0,
                "hydro": 0,
                "total": 0
            },
            "renewablePercentage": 0,
            "carbonFootprint": 0,
            "savingsEstimate": 0,
            "energyIntensity": 0,
            "costs": {
                "electricity": 0,
                "gas": 0,
                "total": 0
            }
        }
    

    total_consumption = sum(item['consumption'] for item in data)
    
    total_generation = {
        "solar": sum(item['generation']['solar'] for item in data),
        "wind": sum(item['generation']['wind'] for item in data),
        "hydro": sum(item['generation']['hydro'] for item in data),
        "total": sum(item['generation']['total'] for item in data)
    }
    
    total_carbon_footprint = sum(item['carbonFootprint'] for item in data)
    
    total_electricity_cost = sum(item['costs']['electricity'] for item in data)
    total_gas_cost = sum(item['costs']['gas'] for item in data)
    
    renewable_percentage = (total_generation['total'] / total_consumption * 100) if total_consumption > 0 else 0
    
 
    savings_estimate = total_generation['total'] * 0.15
    

    days = len(set(item['timestamp'].split()[0] for item in data))
    energy_intensity = total_consumption / days if days > 0 else 0
    
    return {
        "totalConsumption": round(total_consumption, 2),
        "totalGeneration": {
            "solar": round(total_generation['solar'], 2),
            "wind": round(total_generation['wind'], 2),
            "hydro": round(total_generation['hydro'], 2),
            "total": round(total_generation['total'], 2)
        },
        "renewablePercentage": round(renewable_percentage, 2),
        "carbonFootprint": round(total_carbon_footprint, 2),
        "savingsEstimate": round(savings_estimate, 2),
        "energyIntensity": round(energy_intensity, 2),
        "costs": {
            "electricity": round(total_electricity_cost, 2),
            "gas": round(total_gas_cost, 2),
            "total": round(total_electricity_cost + total_gas_cost, 2)
        }
    }
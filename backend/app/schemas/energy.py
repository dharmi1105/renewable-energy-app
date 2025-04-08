from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class EnergyDataBase(BaseModel):
    timestamp: datetime
    energy_type: str
    consumption: float
    generation: float

class EnergyDataCreate(EnergyDataBase):
    pass

class EnergyData(EnergyDataBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True 

class EnergyDataList(BaseModel):
    data: List[EnergyData]

class GenerationData(BaseModel):
    solar: float
    wind: float
    hydro: float
    total: float

class CostData(BaseModel):
    electricity: float
    gas: float
    total: float

class EnergyDataResponse(BaseModel):
    timestamp: str
    consumption: float
    generation: GenerationData
    carbonFootprint: float
    costs: CostData

class EnergyStatsResponse(BaseModel):
    totalConsumption: float
    totalGeneration: GenerationData
    renewablePercentage: float
    carbonFootprint: float
    savingsEstimate: float
    energyIntensity: float
    costs: CostData

class ApplianceData(BaseModel):
    id: str
    name: str
    consumption: float
    unit: str
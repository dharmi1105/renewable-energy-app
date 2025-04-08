from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Renewable Energy API"}

@app.get("/api/energy/data")
async def get_energy_data(timeframe: str = "month"):
    return [
        {
            "timestamp": datetime.now().isoformat(),
            "consumption": 10.5,
            "generation": {
                "solar": 3.2,
                "wind": 2.1,
                "hydro": 1.5,
                "total": 6.8
            },
            "carbonFootprint": 2.3,
            "costs": {
                "electricity": 1.58,
                "gas": 0.53,
                "total": 2.11
            }
        }
    ]

@app.get("/api/energy/stats")
async def get_energy_stats(timeframe: str = "month"):
    return {
        "totalConsumption": 325.5,
        "totalGeneration": {
            "solar": 120.2,
            "wind": 85.4,
            "hydro": 45.7,
            "total": 251.3
        },
        "renewablePercentage": 77.2,
        "carbonFootprint": 37.1,
        "savingsEstimate": 42.5,
        "energyIntensity": 10.85,
        "costs": {
            "electricity": 48.83,
            "gas": 16.28,
            "total": 65.11
        }
    }

@app.get("/api/energy/appliances")
async def get_appliances():
    return [
        {
            "id": "1",
            "name": "Heating & AC",
            "consumption": 1.4,
            "unit": "kWh"
        }
    ]
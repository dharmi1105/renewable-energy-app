from datetime import datetime, timedelta
import random
import numpy as np
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import SessionLocal, Base, engine
from app.models.user import User 
from app.models.energy_data import EnergyData
from app.utils.auth import get_password_hash

def generate_mock_data():
    """
    Generate and store mock energy data in the database
    """
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        demo_user = db.query(User).filter(User.username == "demo").first()
        if not demo_user:
            demo_user = User(
                email="demo@example.com",
                username="demo",
                hashed_password=get_password_hash("password")
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            print(f"Created demo user: {demo_user.username}")
        
        existing_data = db.query(EnergyData).filter(
            EnergyData.user_id == demo_user.id
        ).count()
        
        if existing_data > 0:
            print(f"Mock data already exists for user {demo_user.username}")
            return
        
        start_date = datetime.now() - timedelta(days=365)
        end_date = datetime.now()
        
        energy_types = ["solar", "wind", "hydro"]
        
        print(f"Generating mock data from {start_date} to {end_date}")
        
        current_date = start_date
        day_counter = 0
        while current_date <= end_date:
            day_of_year = current_date.timetuple().tm_yday
            seasonal_factor = 1.0 + 0.3 * np.sin(2 * np.pi * day_of_year / 365)
            
            for hour in range(24):
                time_factor = 0.4 + 0.8 * np.sin(np.pi * (hour - 6) / 12) if 6 <= hour <= 18 else 0.4
                
                for energy_type in energy_types:
                    random_factor = random.uniform(0.8, 1.2)
                    
                    if energy_type == "solar":
                        gen_factor = max(0, np.sin(np.pi * (hour - 6) / 12)) if 6 <= hour <= 18 else 0
                        generation = 2.5 * gen_factor * seasonal_factor * random_factor
                    elif energy_type == "wind":
                        gen_factor = 0.5 + 0.5 * random.random()
                        generation = 1.8 * gen_factor * seasonal_factor * random_factor
                    else:  
                        gen_factor = 0.7 + 0.3 * random.random()
                        generation = 1.2 * gen_factor * seasonal_factor * random_factor
                    
                    consumption = (generation + 1.5) * time_factor * random_factor
                    
                    timestamp = current_date.replace(hour=hour)
                    
                    energy_data = EnergyData(
                        timestamp=timestamp,
                        energy_type=energy_type,
                        consumption=consumption,
                        generation=generation,
                        user_id=demo_user.id
                    )
                    
                    db.add(energy_data)
            
            current_date += timedelta(days=1)
            day_counter += 1
            
            if day_counter % 30 == 0:
                db.commit()
                print(f"Generated data up to {current_date}")
        
        db.commit()
        print("Mock data generation completed successfully")
        
    except Exception as e:
        db.rollback()
        print(f"Error generating mock data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    generate_mock_data()
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class EnergyData(Base):
    __tablename__ = "energy_data"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, index=True)
    energy_type = Column(String)  # solar, wind, hydro, etc.
    consumption = Column(Float)
    generation = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="energy_data")
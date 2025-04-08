import os
import sys
from mock_data_generator import generate_mock_data
from app.database import engine, Base

def init_db():
    """Initialize the database schema and populate with mock data"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
    
    print("Generating mock data...")
    generate_mock_data()
    print("Database initialization complete!")

if __name__ == "__main__":
    init_db()
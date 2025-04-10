# Renewable Energy Dashboard

A full-stack application for monitoring and analyzing renewable energy usage, generation, and emissions within a smart home environment.

## Overview

The Renewable Energy Dashboard provides real-time monitoring and historical analysis of energy consumption, generation, and carbon emissions. Users can track energy usage patterns and get insights for optimizing energy efficiency.

## Features

- **Authentication**: Secure login/register system
- **Dashboard**: Overview of key energy metrics 
- **Energy Analysis**: Consumption and generation tracking with data visualization
- **Cost Analysis**: Cost tracking and savings opportunities
- **Room-by-Room Analysis**: Energy usage by room and device
- **Carbon Emissions**: Carbon footprint tracking with reduction tips

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Database**: SQLite (development)
- **Deployment**: Docker & Docker Compose

## Setup and Installation

### Prerequisites

- Docker and Docker Compose
- Node.js 14+ (for local development)
- Python 3.8+ (for local development)

### Using Docker (Recommended)

1. Clone the repository:

   git clone https://github.com/yourusername/renewable-energy-dashboard.git
   cd renewable-energy-dashboard


2. Start the containers:

   docker-compose up -d


3. Initialize the database:

   docker-compose exec backend python init_db.py


4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Installation

#### Backend

1. Navigate to the backend directory and create a virtual environment:
   
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: .\venv\Scripts\activate
   

2. Install dependencies:
  
   pip install -r requirements.txt
   

3. Initialize the database:
   
   python init_db.py
   

4. Start the server:
  
   python main.py


#### Frontend

1. Navigate to the frontend directory:

   cd frontend


2. Install dependencies:
 
   npm install


3. Start the development server:

   npm start


## API Usage

The API provides several endpoints for accessing energy data:

-  `/api/energy/data`: Get energy consumption and generation data
-  `/api/energy/stats`: Get aggregated energy statistics
-  `/api/energy/appliances`: Get appliance energy consumption
-  `/token`: Authenticate and get access token
-  `/register`: Register a new user

For full API documentation, visit `http://localhost:8000/docs` after starting the server.

### Authentication

Most endpoints require authentication with a JWT token.

Example login:

curl -X POST "http://localhost:8000/token" \
  -d "username=demo&password=password"


Example API call:

curl -X GET "http://localhost:8000/api/energy/data" \
  -H "Authorization: Bearer YOUR_TOKEN"


Demo credentials:
- Username: `demo`
- Password: `password`

## Assumptions

1. **Mock Data**: The application includes a mock data generator that simulates energy data. In a real-world scenario, this would connect to actual IoT devices.

2. **Single Household**: The application assumes a single-household scenario with one primary user.

3. **Energy Sources**: The application focuses on solar, wind, and hydro renewable energy sources.

4. **Simplified Costs**: Energy cost calculations use fixed rates rather than variable time-of-use pricing.

## Future Improvements

1. **Real-time Data Integration**: 
   - Integration with IoT energy monitoring devices
   - Real-time data streaming using WebSockets

2. **Advanced Analytics**:
   - Machine learning for usage prediction
   - Pattern recognition for identifying energy waste

3. **Enhanced User Experience**:
   - Mobile application development
   - Email notifications for energy alerts
   - Voice assistant integration

4. **Smart Home Integration**:
   - Connection with smart home systems
   - Electric vehicle charging management
   - Energy trading capabilities
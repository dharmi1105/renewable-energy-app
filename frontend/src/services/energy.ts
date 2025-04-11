import api from './api';
import { 
  EnergyData, 
  EnergyStats, 
  TimeFrame, 
  ApplianceData,
  CostBreakdownItem,
  CostProjection,
  CostSavingOpportunity,
  EmissionsData,
  EmissionsComparison,
  EmissionsReductionTip,
  RoomUsageData,
  RoomEfficiencyTip
} from '../types/energy';

async function fetchWithFallback<T>(endpoint: string, mockDataFn: () => T, params?: any): Promise<T> {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    return mockDataFn();
  }
}

export const getEnergyData = async (timeframe: TimeFrame = 'month'): Promise<EnergyData[]> => {
  return fetchWithFallback('/api/energy/data', () => mockEnergyData(timeframe), { timeframe });
};

export const getEnergyStats = async (timeframe: TimeFrame = 'month'): Promise<EnergyStats> => {
  return fetchWithFallback('/api/energy/stats', mockEnergyStats, { timeframe });
};

export const getApplianceData = async (): Promise<ApplianceData[]> => {
  return fetchWithFallback('/api/energy/appliances', mockApplianceData);
};

export const getDetailedApplianceData = async (): Promise<ApplianceData[]> => {
  return fetchWithFallback('/api/energy/detailed-appliances', mockDetailedApplianceData);
};

export const getCostBreakdown = async (timeframe: TimeFrame = 'month'): Promise<CostBreakdownItem[]> => {
  return fetchWithFallback('/api/energy/cost-breakdown', mockCostBreakdown, { timeframe });
};

export const getCostProjections = async (): Promise<CostProjection[]> => {
  return fetchWithFallback('/api/energy/cost-projections', mockCostProjections);
};

export const getCostSavingOpportunities = async (): Promise<CostSavingOpportunity[]> => {
  return fetchWithFallback('/api/energy/cost-saving-opportunities', mockCostSavingOpportunities);
};

export const getEmissionsData = async (timeframe: TimeFrame = 'month'): Promise<EmissionsData[]> => {
  return fetchWithFallback('/api/energy/emissions', () => mockEmissionsData(timeframe), { timeframe });
};

export const getEmissionsComparison = async (): Promise<EmissionsComparison[]> => {
  return fetchWithFallback('/api/energy/emissions-comparison', mockEmissionsComparison);
};

export const getEmissionsReductionTips = async (): Promise<EmissionsReductionTip[]> => {
  return fetchWithFallback('/api/energy/emissions-reduction-tips', mockEmissionsReductionTips);
};

export const getRoomUsageData = async (): Promise<RoomUsageData[]> => {
  return fetchWithFallback('/api/energy/room-usage', mockRoomUsageData);
};

export const getRoomEfficiencyTips = async (): Promise<RoomEfficiencyTip[]> => {
  return fetchWithFallback('/api/energy/room-efficiency-tips', mockRoomEfficiencyTips);
};

const mockDetailedApplianceData = (): ApplianceData[] => [
  {
    id: "1",
    name: "Heating & AC",
    consumption: 1.4,
    unit: "kWh",
    timeOfUse: ["06:00-09:00", "17:00-22:00"],
    energyEfficiency: "B",
    standbyPower: 0.05,
    usageHours: 8
  },
  {
    id: "2",
    name: "EV Charge",
    consumption: 0.9,
    unit: "kWh",
    timeOfUse: ["22:00-06:00"],
    energyEfficiency: "A+",
    standbyPower: 0.02,
    usageHours: 4
  },
  {
    id: "3", 
    name: "Refrigerator",
    consumption: 0.7,
    unit: "kWh",
    timeOfUse: ["Various"],
    energyEfficiency: "A++",
    standbyPower: 0.0,
    usageHours: 24
  },
  {
    id: "4",
    name: "Washer & Dryer",
    consumption: 0.6,
    unit: "kWh",
    timeOfUse: ["10:00-12:00", "15:00-17:00"],
    energyEfficiency: "A",
    standbyPower: 0.03,
    usageHours: 2
  },
  {
    id: "5",
    name: "Lighting",
    consumption: 0.5,
    unit: "kWh",
    timeOfUse: ["06:00-08:00", "18:00-23:00"],
    energyEfficiency: "A+++",
    standbyPower: 0.01,
    usageHours: 7
  }
];

const mockCostBreakdown = (): CostBreakdownItem[] => [
  { 
    category: "Electricity", 
    amount: 45.50, 
    percentage: 60, 
    change: -2.3 
  },
  { 
    category: "Gas", 
    amount: 15.25, 
    percentage: 20, 
    change: 1.5 
  },
  { 
    category: "Water Heating", 
    amount: 7.65, 
    percentage: 10, 
    change: -0.8 
  },
  { 
    category: "Renewable Sources", 
    amount: -10.50, 
    percentage: -13.8, 
    change: -5.2 
  },
  { 
    category: "Other", 
    amount: 7.21, 
    percentage: 9.5, 
    change: 0.5 
  }
];

const mockCostProjections = (): CostProjection[] => [
  { month: "Jan", actual: 50.00, projected: 52.00 },
  { month: "Feb", actual: 48.50, projected: 50.00 },
  { month: "Mar", actual: 45.75, projected: 48.00 },
  { month: "Apr", actual: 42.50, projected: 46.00 },
  { month: "May", actual: 40.25, projected: 44.00 },
  { month: "Jun", actual: 38.50, projected: 40.00 },
  { month: "Jul", actual: 35.75, projected: 38.00 },
  { month: "Aug", actual: 36.50, projected: 39.00 },
  { month: "Sep", actual: 38.25, projected: 42.00 },
  { month: "Oct", actual: 42.50, projected: 45.00 },
  { month: "Nov", actual: 47.75, projected: 48.00 },
  { month: "Dec", actual: 52.25, projected: 54.00 }
];

const mockCostSavingOpportunities = (): CostSavingOpportunity[] => [
  {
    id: "1",
    title: "LED Lighting Upgrade",
    description: "Replace old bulbs with LED",
    potentialSavings: 120.00,
    implementationCost: 50.00,
    paybackPeriod: 0.5,
    difficulty: "easy"
  },
  {
    id: "2",
    title: "Smart Thermostat Installation",
    description: "Install a programmable thermostat",
    potentialSavings: 180.00,
    implementationCost: 150.00,
    paybackPeriod: 0.8,
    difficulty: "medium"
  },
  {
    id: "3",
    title: "Solar Panel Installation",
    description: "Install rooftop solar panels",
    potentialSavings: 850.00,
    implementationCost: 3500.00,
    paybackPeriod: 4.1,
    difficulty: "hard"
  }
];

const mockEmissionsData = (timeframe: TimeFrame): EmissionsData[] => [
  {
    timestamp: new Date().toISOString(),
    carbonEmissions: 5.5,
    renewableOffsets: 2.3,
    netEmissions: 3.2,
    sourceBreakdown: {
      electricity: 2.1,
      heating: 1.5,
      transportation: 1.2,
      other: 0.7
    }
  }
];

const mockEmissionsComparison = (): EmissionsComparison[] => [
  {
    category: "Home Energy",
    yourEmissions: 4.5,
    averageEmissions: 5.2,
    unit: "tons CO₂/yr"
  },
  {
    category: "Transportation",
    yourEmissions: 3.2,
    averageEmissions: 4.6,
    unit: "tons CO₂/yr"
  },
  {
    category: "Food",
    yourEmissions: 2.8,
    averageEmissions: 3.3,
    unit: "tons CO₂/yr"
  },
  {
    category: "Consumer Goods",
    yourEmissions: 1.9,
    averageEmissions: 2.2,
    unit: "tons CO₂/yr"
  }
];

const mockEmissionsReductionTips = (): EmissionsReductionTip[] => [
  {
    id: "1",
    title: "Solar Panel Installation",
    description: "Install rooftop solar panels",
    potentialReduction: 2.5,
    difficulty: "medium"
  },
  {
    id: "2",
    title: "Electric Vehicle",
    description: "Switch to an electric vehicle",
    potentialReduction: 1.8,
    difficulty: "hard"
  },
  {
    id: "3",
    title: "Smart Home System",
    description: "Install smart thermostats and lighting",
    potentialReduction: 0.7,
    difficulty: "easy"
  }
];

const mockRoomUsageData = (): RoomUsageData[] => [
  {
    roomId: "1",
    roomName: "Living Room",
    consumption: 120.5,
    percentage: 35,
    temperature: 22.5,
    occupancyRate: 0.6,
    peakHours: [10, 14, 19],
    devices: [
      {
        deviceId: "1",
        deviceName: "TV",
        consumption: 30.2,
        percentage: 25
      },
      {
        deviceId: "2",
        deviceName: "Lighting",
        consumption: 15.8,
        percentage: 13
      }
    ]
  },
  {
    roomId: "2",
    roomName: "Kitchen",
    consumption: 95.3,
    percentage: 28,
    temperature: 23.0,
    occupancyRate: 0.4,
    peakHours: [7, 12, 18],
    devices: [
      {
        deviceId: "3",
        deviceName: "Refrigerator",
        consumption: 45.6,
        percentage: 48
      },
      {
        deviceId: "4",
        deviceName: "Microwave",
        consumption: 25.4,
        percentage: 27
      }
    ]
  },
  {
    roomId: "3",
    roomName: "Bedroom",
    consumption: 75.8,
    percentage: 22,
    temperature: 21.5,
    occupancyRate: 0.5,
    peakHours: [7, 22, 23],
    devices: [
      {
        deviceId: "5",
        deviceName: "Lighting",
        consumption: 12.4,
        percentage: 16
      },
      {
        deviceId: "6",
        deviceName: "Computer",
        consumption: 35.6,
        percentage: 47
      }
    ]
  }
];

const mockRoomEfficiencyTips = (): RoomEfficiencyTip[] => [
  {
    tipId: "1",
    roomId: "1",
    title: "Smart Thermostat",
    description: "Install a smart thermostat",
    potentialSavings: 50.00,
    difficulty: "easy"
  },
  {
    tipId: "2",
    roomId: "1",
    title: "LED Lighting",
    description: "Replace with LED bulbs",
    potentialSavings: 30.00,
    difficulty: "easy"
  },
  {
    tipId: "3",
    roomId: "2",
    title: "Energy Efficient Appliances",
    description: "Upgrade to energy-efficient appliances",
    potentialSavings: 120.00,
    difficulty: "hard"
  },
  {
    tipId: "4",
    roomId: "3",
    title: "Motion Sensors",
    description: "Install motion sensors for lighting",
    potentialSavings: 25.00,
    difficulty: "medium"
  }
];

const mockEnergyData = (timeframe: TimeFrame): EnergyData[] => [
  {
    timestamp: new Date().toISOString(),
    consumption: 10.5,
    generation: {
      solar: 3.2,
      wind: 2.1,
      hydro: 1.5,
      total: 6.8
    },
    carbonFootprint: 2.3,
    costs: {
      electricity: 1.58,
      gas: 0.53,
      total: 2.11
    }
  }
];

const mockEnergyStats = (): EnergyStats => ({
  totalConsumption: 325.5,
  totalGeneration: {
    solar: 120.2,
    wind: 85.4,
    hydro: 45.7,
    total: 251.3
  },
  renewablePercentage: 77.2,
  carbonFootprint: 37.1,
  savingsEstimate: 42.5,
  energyIntensity: 10.85,
  costs: {
    electricity: 48.83,
    gas: 16.28,
    total: 65.11
  }
});

const mockApplianceData = (): ApplianceData[] => [
  {
    id: "1",
    name: "Heating & AC",
    consumption: 1.4,
    unit: "kWh"
  },
  {
    id: "2",
    name: "EV Charge",
    consumption: 0.9,
    unit: "kWh"
  },
  {
    id: "3",
    name: "Refrigerator",
    consumption: 0.7,
    unit: "kWh"
  },
  {
    id: "4",
    name: "Washer & Dryer",
    consumption: 0.6,
    unit: "kWh"
  },
  {
    id: "5",
    name: "Lighting",
    consumption: 0.5,
    unit: "kWh"
  }
];

export default {
  getDetailedApplianceData,
  getCostBreakdown,
  getCostProjections,
  getCostSavingOpportunities,
  getEmissionsData,
  getEmissionsComparison,
  getEmissionsReductionTips,
  getRoomUsageData,
  getRoomEfficiencyTips,
  getEnergyData,
  getEnergyStats,
  getApplianceData
};
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


export const getDetailedApplianceData = async (): Promise<ApplianceData[]> => {
  try {
    const response = await api.get('/api/energy/detailed-appliances');
    return response.data;
  } catch (error) {
    console.error('Error fetching detailed appliance data:', error);
    return mockDetailedApplianceData();
  }
};


export const getCostBreakdown = async (
  timeframe: TimeFrame = 'month'
): Promise<CostBreakdownItem[]> => {
  try {
    const response = await api.get('/api/energy/cost-breakdown', {
      params: { timeframe }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cost breakdown:', error);
    return mockCostBreakdown();
  }
};

export const getCostProjections = async (): Promise<CostProjection[]> => {
  try {
    const response = await api.get('/api/energy/cost-projections');
    return response.data;
  } catch (error) {
    console.error('Error fetching cost projections:', error);
    return mockCostProjections();
  }
};

export const getCostSavingOpportunities = async (): Promise<CostSavingOpportunity[]> => {
  try {
    const response = await api.get('/api/energy/cost-saving-opportunities');
    return response.data;
  } catch (error) {
    console.error('Error fetching cost saving opportunities:', error);
    return mockCostSavingOpportunities();
  }
};


export const getEmissionsData = async (
  timeframe: TimeFrame = 'month'
): Promise<EmissionsData[]> => {
  try {
    const response = await api.get('/api/energy/emissions', {
      params: { timeframe }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching emissions data:', error);
    return mockEmissionsData(timeframe);
  }
};

export const getEmissionsComparison = async (): Promise<EmissionsComparison[]> => {
  try {
    const response = await api.get('/api/energy/emissions-comparison');
    return response.data;
  } catch (error) {
    console.error('Error fetching emissions comparison:', error);
    return mockEmissionsComparison();
  }
};

export const getEmissionsReductionTips = async (): Promise<EmissionsReductionTip[]> => {
  try {
    const response = await api.get('/api/energy/emissions-reduction-tips');
    return response.data;
  } catch (error) {
    console.error('Error fetching emissions reduction tips:', error);
    return mockEmissionsReductionTips();
  }
};


export const getRoomUsageData = async (): Promise<RoomUsageData[]> => {
  try {
    const response = await api.get('/api/energy/room-usage');
    return response.data;
  } catch (error) {
    console.error('Error fetching room usage data:', error);
    return mockRoomUsageData();
  }
};

export const getRoomEfficiencyTips = async (): Promise<RoomEfficiencyTip[]> => {
  try {
    const response = await api.get('/api/energy/room-efficiency-tips');
    return response.data;
  } catch (error) {
    console.error('Error fetching room efficiency tips:', error);
    return mockRoomEfficiencyTips();
  }
};


export const getEnergyData = async (
  timeframe: TimeFrame = 'month'
): Promise<EnergyData[]> => {
  try {
    const response = await api.get(`/api/energy/data`, {
      params: { timeframe }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching energy data:', error);
    return mockEnergyData(timeframe);
  }
};

export const getEnergyStats = async (
  timeframe: TimeFrame = 'month'
): Promise<EnergyStats> => {
  try {
    const response = await api.get(`/api/energy/stats`, {
      params: { timeframe }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching energy stats:', error);
    return mockEnergyStats();
  }
};

export const getApplianceData = async (): Promise<ApplianceData[]> => {
  try {
    const response = await api.get('/api/energy/appliances');
    return response.data;
  } catch (error) {
    console.error('Error fetching appliance data:', error);
    return mockApplianceData();
  }
};


const mockEnergyData = (timeframe: TimeFrame): EnergyData[] => {
  const now = new Date();
  const data: EnergyData[] = [];
  let numberOfPoints = 0;

  switch (timeframe) {
    case 'today':
      numberOfPoints = 24; 
      break;
    case 'month':
      numberOfPoints = 30; 
      break;
    case 'year':
      numberOfPoints = 12; 
      break;
    default:
      numberOfPoints = 30; 
  }

  for (let i = 0; i < numberOfPoints; i++) {
    const date = new Date(now);

    if (timeframe === 'today') {
      
      date.setHours(i, 0, 0, 0);
    } else if (timeframe === 'month') {
      
      date.setDate(now.getDate() - (numberOfPoints - i - 1));
      date.setHours(12, 0, 0, 0); 
    } else {
      
      date.setMonth(now.getMonth() - (numberOfPoints - i - 1));
      date.setDate(15); 
      date.setHours(12, 0, 0, 0); 
    }

    
    const baseConsumption = 8 + Math.random() * 4; 
    const solarGen = 2 + Math.random() * 2; 
    const windGen = 1 + Math.random() * 2; 
    const hydroGen = 0.5 + Math.random() * 1.5; 
    const totalGen = solarGen + windGen + hydroGen;

    
    const seasonalFactor = timeframe !== 'today'
      ? 1 + 0.3 * Math.sin(2 * Math.PI * i / numberOfPoints)
      : 1;

    
    const timeOfDayFactor = timeframe === 'today'
      ? (i >= 6 && i <= 18)
        ? 1 + 0.5 * Math.sin(Math.PI * (i - 6) / 12) 
        : 0.6 
      : 1;

    const consumption = baseConsumption * seasonalFactor * timeOfDayFactor;
    const generation = {
      solar: solarGen * seasonalFactor * (timeframe === 'today' && (i < 6 || i > 18) ? 0.1 : 1), 
      wind: windGen * seasonalFactor,
      hydro: hydroGen * seasonalFactor,
      total: 0 
    };
    generation.total = generation.solar + generation.wind + generation.hydro;

    const electricityCost = consumption * 0.15; 
    const gasCost = consumption * 0.05; 

    data.push({
      timestamp: date.toISOString(),
      consumption,
      generation,
      carbonFootprint: Math.max(0, consumption - generation.total) * 0.5,
      costs: {
        electricity: electricityCost,
        gas: gasCost,
        total: electricityCost + gasCost
      }
    });
  }

  return data;
};

const mockEnergyStats = (): EnergyStats => {
  
  const totalConsumption = 325.5 + Math.random() * 50;
  const solarGen = 120.2 + Math.random() * 30;
  const windGen = 85.4 + Math.random() * 20;
  const hydroGen = 45.7 + Math.random() * 15;
  const totalGen = solarGen + windGen + hydroGen;
  const renewablePerc = (totalGen / totalConsumption) * 100;

  return {
    totalConsumption,
    totalGeneration: {
      solar: solarGen,
      wind: windGen,
      hydro: hydroGen,
      total: totalGen
    },
    renewablePercentage: renewablePerc,
    carbonFootprint: Math.max(0, totalConsumption - totalGen) * 0.5,
    savingsEstimate: totalGen * 0.15,
    energyIntensity: totalConsumption / 30,
    costs: {
      electricity: totalConsumption * 0.15,
      gas: totalConsumption * 0.05,
      total: (totalConsumption * 0.15) + (totalConsumption * 0.05)
    }
  };
};

const mockApplianceData = (): ApplianceData[] => [
  {
    id: "1",
    name: "Heating & AC",
    consumption: 1.4,
    unit: "kWh",
    energyEfficiency: "A+",
    standbyPower: 0.1,
    usageHours: 5,
    timeOfUse: ["06:00-09:00", "17:00-22:00"]
  },
  {
    id: "2",
    name: "EV Charge",
    consumption: 0.9,
    unit: "kWh",
    energyEfficiency: "A++",
    standbyPower: 0,
    usageHours: 3,
    timeOfUse: ["22:00-06:00"]
  },
  {
    id: "3",
    name: "Refrigerator",
    consumption: 0.7,
    unit: "kWh",
    energyEfficiency: "A+",
    standbyPower: 0.7,
    usageHours: 24,
    timeOfUse: ["Various"]
  },
  {
    id: "4",
    name: "Washer & Dryer",
    consumption: 0.6,
    unit: "kWh",
    energyEfficiency: "B",
    standbyPower: 0.02,
    usageHours: 2,
    timeOfUse: ["10:00-12:00"]
  },
  {
    id: "5",
    name: "Lighting",
    consumption: 0.5,
    unit: "kWh",
    energyEfficiency: "A+++",
    standbyPower: 0,
    usageHours: 6,
    timeOfUse: ["17:00-23:00"]
  },
  {
    id: "6",
    name: "Other",
    consumption: 0.3,
    unit: "kWh",
    energyEfficiency: "C",
    standbyPower: 0.1,
    usageHours: 4,
    timeOfUse: ["Various"]
  }
];

const mockDetailedApplianceData = (): ApplianceData[] => {
  
  return mockApplianceData();
};


const mockCostBreakdown = (): CostBreakdownItem[] => [
  { category: "Electricity", amount: 45.50, percentage: 60, change: -2.3 },
  { category: "Heating", amount: 20.75, percentage: 25, change: 1.5 },
  { category: "Appliances", amount: 10.25, percentage: 12, change: -0.8 },
  { category: "Lighting", amount: 2.50, percentage: 3, change: -5.2 }
];


const mockCostProjections = (): CostProjection[] => [
  { month: "Jan", actual: 50.00, projected: 52.00 },
  { month: "Feb", actual: 48.50, projected: 50.00 },
  { month: "Mar", actual: 47.00, projected: 49.00 },
  { month: "Apr", actual: 45.50, projected: 48.00 },
  { month: "May", actual: 42.00, projected: 47.00 },
  { month: "Jun", actual: 40.00, projected: 45.00 },
  { month: "Jul", actual: 0, projected: 43.00 },
  { month: "Aug", actual: 0, projected: 45.00 },
  { month: "Sep", actual: 0, projected: 48.00 },
  { month: "Oct", actual: 0, projected: 50.00 },
  { month: "Nov", actual: 0, projected: 52.00 },
  { month: "Dec", actual: 0, projected: 55.00 }
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
    title: "Smart Thermostat",
    description: "Install a smart thermostat to optimize heating & cooling",
    potentialSavings: 180.00,
    implementationCost: 200.00,
    paybackPeriod: 1.2,
    difficulty: "medium"
  },
  {
    id: "3",
    title: "Solar Panels",
    description: "Install rooftop solar panels",
    potentialSavings: 850.00,
    implementationCost: 6000.00,
    paybackPeriod: 7.5,
    difficulty: "hard"
  }
];

const mockEmissionsData = (timeframe: TimeFrame): EmissionsData[] => {
  const data: EmissionsData[] = [];
  const now = new Date();

  
  const dataPoints = timeframe === 'today' ? 24 :
    timeframe === 'month' ? 30 : 12;

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(now);

    if (timeframe === 'today') {
      date.setHours(i);
    } else if (timeframe === 'month') {
      date.setDate(i + 1);
    } else {
      date.setMonth(i);
    }

    
    const carbonEmissions = 3 + Math.random() * 4;
    const renewableOffsets = 1 + Math.random() * 3;
    const netEmissions = Math.max(0, carbonEmissions - renewableOffsets);

    
    const electricity = 1 + Math.random() * 2;
    const heating = 0.8 + Math.random() * 1.2;
    const transportation = 0.7 + Math.random() * 1;
    const other = 0.5 + Math.random() * 0.5;

    data.push({
      timestamp: date.toISOString(),
      carbonEmissions,
      renewableOffsets,
      netEmissions,
      sourceBreakdown: {
        electricity,
        heating,
        transportation,
        other
      }
    });
  }

  return data;
};

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
    averageEmissions: 4.8,
    unit: "tons CO₂/yr"
  },
  {
    category: "Diet",
    yourEmissions: 2.1,
    averageEmissions: 2.5,
    unit: "tons CO₂/yr"
  },
  {
    category: "Consumer Goods",
    yourEmissions: 1.8,
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
    description: "Switch to an electric vehicle for daily commuting",
    potentialReduction: 1.8,
    difficulty: "hard"
  },
  {
    id: "3",
    title: "Smart Thermostat",
    description: "Install a programmable thermostat",
    potentialReduction: 0.8,
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
    peakHours: [10, 14, 19, 20],
    devices: [
      { deviceId: "1-1", deviceName: "TV", consumption: 30.2, percentage: 25 },
      { deviceId: "1-2", deviceName: "Lights", consumption: 15.5, percentage: 13 },
      { deviceId: "1-3", deviceName: "Gaming Console", consumption: 22.3, percentage: 18 },
      { deviceId: "1-4", deviceName: "Home Assistant", consumption: 5.8, percentage: 5 }
    ]
  },
  {
    roomId: "2",
    roomName: "Kitchen",
    consumption: 95.2,
    percentage: 28,
    temperature: 23.1,
    occupancyRate: 0.4,
    peakHours: [7, 8, 12, 18, 19],
    devices: [
      { deviceId: "2-1", deviceName: "Refrigerator", consumption: 35.8, percentage: 38 },
      { deviceId: "2-2", deviceName: "Microwave", consumption: 18.2, percentage: 19 },
      { deviceId: "2-3", deviceName: "Coffee Maker", consumption: 10.5, percentage: 11 },
      { deviceId: "2-4", deviceName: "Lights", consumption: 8.3, percentage: 9 }
    ]
  },
  {
    roomId: "3",
    roomName: "Bedroom",
    consumption: 65.3,
    percentage: 19,
    temperature: 21.8,
    occupancyRate: 0.5,
    peakHours: [6, 7, 22, 23],
    devices: [
      { deviceId: "3-1", deviceName: "Lights", consumption: 12.8, percentage: 20 },
      { deviceId: "3-2", deviceName: "TV", consumption: 18.5, percentage: 28 },
      { deviceId: "3-3", deviceName: "Phone Charger", consumption: 5.2, percentage: 8 },
      { deviceId: "3-4", deviceName: "Fan", consumption: 8.6, percentage: 13 }
    ]
  },
  {
    roomId: "4",
    roomName: "Home Office",
    consumption: 52.5,
    percentage: 15,
    temperature: 22.0,
    occupancyRate: 0.35,
    peakHours: [9, 10, 11, 14, 15, 16],
    devices: [
      { deviceId: "4-1", deviceName: "Computer", consumption: 25.6, percentage: 49 },
      { deviceId: "4-2", deviceName: "Monitor", consumption: 12.3, percentage: 23 },
      { deviceId: "4-3", deviceName: "Printer", consumption: 5.8, percentage: 11 },
      { deviceId: "4-4", deviceName: "Lights", consumption: 6.2, percentage: 12 }
    ]
  },
  {
    roomId: "5",
    roomName: "Bathroom",
    consumption: 10.8,
    percentage: 3,
    temperature: 23.5,
    occupancyRate: 0.15,
    peakHours: [7, 8, 20, 21],
    devices: [
      { deviceId: "5-1", deviceName: "Lights", consumption: 5.3, percentage: 49 },
      { deviceId: "5-2", deviceName: "Hair Dryer", consumption: 3.8, percentage: 35 },
      { deviceId: "5-3", deviceName: "Electric Toothbrush", consumption: 0.9, percentage: 8 }
    ]
  }
];

const mockRoomEfficiencyTips = (): RoomEfficiencyTip[] => [
  {
    tipId: "1",
    roomId: "1",
    title: "Smart Thermostat",
    description: "Install a smart thermostat to optimize heating and cooling in your living room",
    potentialSavings: 65.00,
    difficulty: "easy"
  },
  {
    tipId: "2",
    roomId: "1",
    title: "LED Lighting",
    description: "Replace all living room lights with LED bulbs",
    potentialSavings: 35.00,
    difficulty: "easy"
  },
  {
    tipId: "3",
    roomId: "2",
    title: "Energy Star Appliances",
    description: "Upgrade to Energy Star certified kitchen appliances",
    potentialSavings: 120.00,
    difficulty: "hard"
  },
  {
    tipId: "4",
    roomId: "2",
    title: "Efficient Cooking",
    description: "Use microwave or electric kettle instead of stove when possible",
    potentialSavings: 25.00,
    difficulty: "easy"
  },
  {
    tipId: "5",
    roomId: "3",
    title: "Smart Power Strip",
    description: "Use a smart power strip to eliminate phantom power usage in bedroom",
    potentialSavings: 30.00,
    difficulty: "easy"
  },
  {
    tipId: "6",
    roomId: "4",
    title: "Low-Flow Fixtures",
    description: "Install low-flow showerheads and faucets in bathroom",
    potentialSavings: 40.00,
    difficulty: "medium"
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
export type TimeFrame = 'today' | 'month' | 'year';

export interface GenerationData {
  solar: number;
  wind: number;
  hydro: number;
  total: number;
}

export interface CostData {
  electricity: number;
  gas: number;
  total: number;
}

export interface EnergyData {
  timestamp: string;
  consumption: number;
  generation: GenerationData;
  carbonFootprint: number;
  costs: CostData;
}

export interface EnergyStats {
  totalConsumption: number;
  totalGeneration: GenerationData;
  renewablePercentage: number;
  carbonFootprint: number;
  savingsEstimate: number;
  energyIntensity: number;
  costs: CostData;
}

export interface ApplianceData {
  id: string;
  name: string;
  consumption: number;
  unit: string;
  timeOfUse?: string[];
  energyEfficiency?: string;
  standbyPower?: number;
  usageHours?: number;
}


export interface CostBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  change: number;
}

export interface CostProjection {
  month: string;
  actual: number;
  projected: number;
}

export interface CostSavingOpportunity {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  implementationCost?: number;
  paybackPeriod?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}


export interface EmissionsData {
  timestamp: string;
  carbonEmissions: number;
  renewableOffsets: number;
  netEmissions: number;
  sourceBreakdown: {
    electricity: number;
    heating: number;
    transportation: number;
    other: number;
  };
}

export interface EmissionsComparison {
  category: string;
  yourEmissions: number;
  averageEmissions: number;
  unit: string;
}

export interface EmissionsReductionTip {
  id: string;
  title: string;
  description: string;
  potentialReduction: number;
  difficulty: 'easy' | 'medium' | 'hard';
}


export interface DeviceData {
  deviceId: string;
  deviceName: string;
  consumption: number;
  percentage: number;
}

export interface RoomUsageData {
  roomId: string;
  roomName: string;
  consumption: number;
  percentage: number;
  temperature?: number;
  occupancyRate: number;
  peakHours: number[];
  devices: DeviceData[];
}

export interface RoomEfficiencyTip {
  tipId: string;
  roomId: string;
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
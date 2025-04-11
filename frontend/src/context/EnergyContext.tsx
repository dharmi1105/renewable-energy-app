import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  getEnergyData, 
  getEnergyStats, 
  getApplianceData,
  getDetailedApplianceData,
  getCostBreakdown,
  getCostProjections,
  getCostSavingOpportunities,
  getEmissionsData,
  getEmissionsComparison,
  getEmissionsReductionTips,
  getRoomUsageData,
  getRoomEfficiencyTips
} from '../services/energy';

import { 
  EnergyData, 
  EnergyStats, 
  ApplianceData, 
  TimeFrame,
  CostBreakdownItem,
  CostProjection,
  CostSavingOpportunity,
  EmissionsData,
  EmissionsComparison,
  EmissionsReductionTip,
  RoomUsageData,
  RoomEfficiencyTip
} from '../types/energy';

import { useAuth } from './AuthContext';

interface EnergyProviderProps {
  children: ReactNode;
}

interface EnergyContextType {

  energyData: EnergyData[];
  energyStats: EnergyStats;
  appliances: ApplianceData[];
  

  detailedAppliances: ApplianceData[];
  
  costBreakdown: CostBreakdownItem[];
  costProjections: CostProjection[];
  costSavingOpportunities: CostSavingOpportunity[];
  
  emissionsData: EmissionsData[];
  emissionsComparison: EmissionsComparison[];
  emissionsReductionTips: EmissionsReductionTip[];
  

  roomUsageData: RoomUsageData[];
  roomEfficiencyTips: RoomEfficiencyTip[];
  

  timeframe: TimeFrame;
  setTimeframe: (timeframe: TimeFrame) => void;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const createDefaultEnergyStats = (): EnergyStats => ({
  totalConsumption: 0,
  totalGeneration: {
    solar: 0,
    wind: 0,
    hydro: 0,
    total: 0
  },
  renewablePercentage: 0,
  carbonFootprint: 0,
  savingsEstimate: 0,
  energyIntensity: 0,
  costs: {
    electricity: 0,
    gas: 0,
    total: 0
  }
});

const EnergyContext = createContext<EnergyContextType>({
 
  energyData: [],
  energyStats: createDefaultEnergyStats(),
  appliances: [],
  
  detailedAppliances: [],
  
  costBreakdown: [],
  costProjections: [],
  costSavingOpportunities: [],
  
  emissionsData: [],
  emissionsComparison: [],
  emissionsReductionTips: [],
  

  roomUsageData: [],
  roomEfficiencyTips: [],
  

  timeframe: 'month',
  setTimeframe: () => {},
  loading: true,
  error: null,
  refreshData: async () => {}
});

export const EnergyProvider: React.FC<EnergyProviderProps> = ({ children }) => {

  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [energyStats, setEnergyStats] = useState<EnergyStats>(createDefaultEnergyStats());
  const [appliances, setAppliances] = useState<ApplianceData[]>([]);
  

  const [detailedAppliances, setDetailedAppliances] = useState<ApplianceData[]>([]);
  
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdownItem[]>([]);
  const [costProjections, setCostProjections] = useState<CostProjection[]>([]);
  const [costSavingOpportunities, setCostSavingOpportunities] = useState<CostSavingOpportunity[]>([]);

  const [emissionsData, setEmissionsData] = useState<EmissionsData[]>([]);
  const [emissionsComparison, setEmissionsComparison] = useState<EmissionsComparison[]>([]);
  const [emissionsReductionTips, setEmissionsReductionTips] = useState<EmissionsReductionTip[]>([]);
  
  const [roomUsageData, setRoomUsageData] = useState<RoomUsageData[]>([]);
  const [roomEfficiencyTips, setRoomEfficiencyTips] = useState<RoomEfficiencyTip[]>([]);
  

  const [timeframe, setTimeframe] = useState<TimeFrame>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { authState } = useAuth();

  const fetchEnergyData = async () => {
    if (!authState.isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [data, stats, applianceData] = await Promise.all([
        getEnergyData(timeframe),
        getEnergyStats(timeframe),
        getApplianceData()
      ]);

      setEnergyData(data);
      setEnergyStats(stats);
      setAppliances(applianceData);
 
      try {

        const detailedApplianceResult = await getDetailedApplianceData();
        setDetailedAppliances(detailedApplianceResult);
      } catch (appError) {
        console.error('Error fetching detailed appliance data:', appError);
      }
      
      try {
        const [breakdownData, projectionData, savingsData] = await Promise.all([
          getCostBreakdown(timeframe),
          getCostProjections(),
          getCostSavingOpportunities()
        ]);
        
        setCostBreakdown(breakdownData);
        setCostProjections(projectionData);
        setCostSavingOpportunities(savingsData);
      } catch (costError) {
        console.error('Error fetching cost data:', costError);
      }
      
      try {
       
        const [emissions, comparison, tips] = await Promise.all([
          getEmissionsData(timeframe),
          getEmissionsComparison(),
          getEmissionsReductionTips()
        ]);
        
        setEmissionsData(emissions);
        setEmissionsComparison(comparison);
        setEmissionsReductionTips(tips);
      } catch (emissionsError) {
        console.error('Error fetching emissions data:', emissionsError);
      }
      
      try {
  
        const [rooms, roomTips] = await Promise.all([
          getRoomUsageData(),
          getRoomEfficiencyTips()
        ]);
        
        setRoomUsageData(rooms);
        setRoomEfficiencyTips(roomTips);
      } catch (roomError) {
        console.error('Error fetching room data:', roomError);
      }
      
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching core energy data:', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchEnergyData();
  }, [timeframe, authState.isAuthenticated]);

  const contextValue = {
    energyData,
    energyStats,
    appliances,

    detailedAppliances,

    costBreakdown,
    costProjections,
    costSavingOpportunities,

    emissionsData,
    emissionsComparison,
    emissionsReductionTips,
 
    roomUsageData,
    roomEfficiencyTips,

    timeframe,
    setTimeframe,
    loading,
    error,
    refreshData: fetchEnergyData
  };

  return (
    <EnergyContext.Provider value={contextValue}>
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => useContext(EnergyContext);

export default EnergyContext;
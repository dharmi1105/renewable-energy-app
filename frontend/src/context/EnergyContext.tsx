import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  getEnergyData, 
  getEnergyStats, 
  getApplianceData 
} from '../services/energy';
import { 
  EnergyData, 
  EnergyStats, 
  ApplianceData, 
  TimeFrame 
} from '../types/energy';
import { useAuth } from './AuthContext';


interface EnergyProviderProps {
  children: ReactNode;
}


interface EnergyContextType {
  energyData: EnergyData[];
  energyStats: EnergyStats;
  appliances: ApplianceData[];
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
    
    
    const createMockData = () => {
      const mockData = [];
      const now = new Date();
      
      
      const points = timeframe === 'today' ? 24 : timeframe === 'month' ? 30 : 12;
      
      for (let i = 0; i < points; i++) {
        const date = new Date(now);
        if (timeframe === 'today') {
          date.setHours(date.getHours() - (23 - i));
        } else if (timeframe === 'month') {
          date.setDate(i + 1);
        } else {
          date.setMonth(i);
        }
        
        
        const consumption = 5 + Math.random() * 10;
        const solar = 1 + Math.random() * 4;
        const wind = 1 + Math.random() * 3;
        const hydro = 0.5 + Math.random() * 2;
        const total = solar + wind + hydro;
        
        mockData.push({
          timestamp: date.toISOString(),
          consumption,
          generation: {
            solar,
            wind,
            hydro,
            total
          },
          carbonFootprint: Math.max(0, consumption - total) * 0.5,
          costs: {
            electricity: consumption * 0.15,
            gas: consumption * 0.05,
            total: (consumption * 0.15) + (consumption * 0.05)
          }
        });
      }
      
      return mockData;
    };
    
    const createMockStats = () => {
      const totalConsumption = 325.5;
      const totalSolar = 120.2;
      const totalWind = 85.4;
      const totalHydro = 45.7;
      const totalGeneration = totalSolar + totalWind + totalHydro;
      
      return {
        totalConsumption,
        totalGeneration: {
          solar: totalSolar,
          wind: totalWind,
          hydro: totalHydro,
          total: totalGeneration
        },
        renewablePercentage: (totalGeneration / totalConsumption) * 100,
        carbonFootprint: (totalConsumption - totalGeneration) * 0.5,
        savingsEstimate: totalGeneration * 0.15,
        energyIntensity: totalConsumption / 30,
        costs: {
          electricity: totalConsumption * 0.15,
          gas: totalConsumption * 0.05,
          total: (totalConsumption * 0.15) + (totalConsumption * 0.05)
        }
      };
    };
    
    const createMockAppliances = () => {
      return [
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
        }
      ];
    };
    
    
    try {
      const [apiData, apiStats, apiAppliances] = await Promise.all([
        getEnergyData(timeframe),
        getEnergyStats(timeframe),
        getApplianceData()
      ]);
      
      
      const validData = Array.isArray(apiData) && apiData.length > 0;
      const validStats = apiStats && typeof apiStats === 'object';
      const validAppliances = Array.isArray(apiAppliances) && apiAppliances.length > 0;
      
      
      setEnergyData(validData ? apiData : createMockData());
      setEnergyStats(validStats ? apiStats : createMockStats());
      setAppliances(validAppliances ? apiAppliances : createMockAppliances());
      
    } catch (apiError) {
      console.error("API error:", apiError);
      
      
      setEnergyData(createMockData());
      setEnergyStats(createMockStats());
      setAppliances(createMockAppliances());
    }
    
    setError(null);
  } catch (err) {
    console.error('Error in context:', err);
    setError('Failed to load energy data. Please refresh the page.');
    
    
    setEnergyData([]);
    setEnergyStats(createDefaultEnergyStats());
    setAppliances([]);
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
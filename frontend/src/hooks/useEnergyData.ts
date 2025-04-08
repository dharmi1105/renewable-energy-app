import { useMemo } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { format } from 'date-fns';
import { EnergyData, TimeFrame } from '../types/energy';
import { parseISO, formatDateByTimeframe } from '../utils/formatters';

const useEnergyData = () => {
  const { energyData, timeframe } = useEnergy();
  
  
  const formattedData = useMemo(() => {
    return energyData.map(item => ({
      ...item,
      formattedDate: formatDateByTimeframe(item.timestamp, timeframe)
    }));
  }, [energyData, timeframe]);
  
  
  const generationData = useMemo(() => {
    
    const totalSolar = energyData.reduce((sum, item) => sum + item.generation.solar, 0);
    const totalWind = energyData.reduce((sum, item) => sum + item.generation.wind, 0);
    const totalHydro = energyData.reduce((sum, item) => sum + item.generation.hydro, 0);
    
    
    return [
      { name: 'Solar', value: totalSolar },
      { name: 'Wind', value: totalWind },
      { name: 'Hydro', value: totalHydro },
    ];
  }, [energyData]);
  
  
  const comparisonData = useMemo(() => {
    return energyData.map(item => ({
      timestamp: item.timestamp,
      formattedDate: formatDateByTimeframe(item.timestamp, timeframe),
      consumption: item.consumption,
      generation: item.generation.total,
      difference: item.consumption - item.generation.total
    }));
  }, [energyData, timeframe]);
  
  return {
    rawData: energyData,
    formattedData,
    generationData,
    comparisonData,
    formatDate: (timestamp: string) => formatDateByTimeframe(timestamp, timeframe)
  };
};

export default useEnergyData;
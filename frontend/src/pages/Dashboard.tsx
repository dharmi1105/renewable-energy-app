import React from 'react';
import { useEnergy } from '../context/EnergyContext';
import ConsumptionChart from '../components/charts/ConsumptionChart';
import GenerationChart from '../components/charts/GenerationChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import StatCard from '../components/ui/StatCard';
import { BoltIcon, ArrowTrendingUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { 
    energyData, 
    energyStats, 
    timeframe, 
    setTimeframe, 
    loading, 
    error, 
    refreshData 
  } = useEnergy();

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={refreshData} />;
  }

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <div className="py-6 px-6 bg-gray-900">
      <div className="flex justify-end mb-6">
        <button 
          onClick={refreshData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
        >
          Refresh Data
        </button>
      </div>
      
      <div className="grid grid-cols-3 bg-gray-800 rounded-lg overflow-hidden mb-6">
        <button 
          onClick={() => setTimeframe('today')}
          className={`py-3 text-center transition-colors ${timeframe === 'today' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
        >
          TODAY
        </button>
        <button 
          onClick={() => setTimeframe('month')}
          className={`py-3 text-center transition-colors ${timeframe === 'month' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
        >
          MONTH
        </button>
        <button 
          onClick={() => setTimeframe('year')}
          className={`py-3 text-center transition-colors ${timeframe === 'year' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
        >
          YEAR
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="TOTAL COST"
          value={`$${formatNumber(energyStats?.costs?.total || 0)}`}
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
        />
        
        <StatCard 
          title="USAGE ESTIMATE"
          value={`${formatNumber(energyStats?.totalConsumption || 0, 1)} kWh`}
          icon={<BoltIcon className="h-6 w-6" />}
        />
        
        <StatCard 
          title="CARBON FOOTPRINT"
          value={`${formatNumber(energyStats?.carbonFootprint || 0, 1)} kg`}
          icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
          change={{
            value: 77.20,
            isPositive: false,
            isGood: true,
          }}
        />
      </div>
     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-medium text-white mb-4">ENERGY CONSUMPTION</h2>
          {energyData && energyData.length > 0 ? (
            <ConsumptionChart data={energyData} timeframe={timeframe} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No consumption data available
            </div>
          )}
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-medium text-white mb-4">GENERATION SOURCES</h2>
          {energyData && energyData.length > 0 ? (
            <GenerationChart data={energyData} timeframe={timeframe} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No generation data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
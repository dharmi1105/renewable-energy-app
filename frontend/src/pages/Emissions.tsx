import React, { useState, useEffect } from 'react';
import { 
  CloudIcon, 
  ScaleIcon, 
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline';

import DashboardTabs from '../components/ui/DashboardTabs';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

import { 
  getEmissionsData, 
  getEmissionsComparison, 
  getEmissionsReductionTips 
} from '../services/energy';
import { 
  TimeFrame, 
  EmissionsData, 
  EmissionsComparison, 
  EmissionsReductionTip 
} from '../types/energy';


import EmissionsChart from '../components/charts/EmissionsChart';
import EmissionsSourceChart from '../components/charts/EmissionsSourceChart';

import EmissionsComparisonChart from '../components/charts/EmissionsComparisonChart';

const Emissions: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('month');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [emissionsData, setEmissionsData] = useState<EmissionsData[]>([]);
  const [comparisons, setComparisons] = useState<EmissionsComparison[]>([]);
  const [reductionTips, setReductionTips] = useState<EmissionsReductionTip[]>([]);
  
  
  const totalEmissions = emissionsData.reduce((sum, item) => sum + item.netEmissions, 0);
  const totalOffsets = emissionsData.reduce((sum, item) => sum + item.renewableOffsets, 0);
  const averageDailyEmissions = totalEmissions / (emissionsData.length || 1);
  
  
  const totalPotentialReduction = reductionTips.reduce((sum, tip) => sum + tip.potentialReduction, 0);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        
        const [emissions, comparisonData, tipsData] = await Promise.all([
          getEmissionsData(timeframe),
          getEmissionsComparison(),
          getEmissionsReductionTips()
        ]);
        
        setEmissionsData(emissions);
        setComparisons(comparisonData);
        setReductionTips(tipsData);
      } catch (err) {
        setError('Failed to load emissions data. Please try again.');
        console.error('Error fetching emissions data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [timeframe]);
  
  
  const tabs = [
    { id: 'today', label: 'TODAY' },
    { id: 'month', label: 'MONTH' },
    { id: 'year', label: 'YEAR' },
  ];
  
  
  const formatWithUnit = (value: number, unit: string, decimals: number = 1) => {
    return `${value.toFixed(decimals)} ${unit}`;
  };
  
  
  const calculateAverageSourceBreakdown = () => {
    if (emissionsData.length === 0) return null;
    
    let electricity = 0;
    let heating = 0;
    let transportation = 0;
    let other = 0;
    
    emissionsData.forEach(item => {
      electricity += item.sourceBreakdown.electricity;
      heating += item.sourceBreakdown.heating;
      transportation += item.sourceBreakdown.transportation;
      other += item.sourceBreakdown.other;
    });
    
    return [
      { name: 'Electricity', value: electricity / emissionsData.length },
      { name: 'Heating', value: heating / emissionsData.length },
      { name: 'Transportation', value: transportation / emissionsData.length },
      { name: 'Other', value: other / emissionsData.length }
    ];
  };
  
  if (isLoading) {
    return (
      <div className="py-6 px-8 ml-60 flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-6 px-8 ml-60">
        <ErrorAlert message={error} />
      </div>
    );
  }

  return (
    <div className="py-6 px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Carbon Emissions Analysis</h1>
      </div>
      
      <DashboardTabs 
        tabs={tabs}
        activeTab={timeframe}
        onChange={(tab) => setTimeframe(tab as TimeFrame)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="TOTAL CARBON FOOTPRINT"
          value={formatWithUnit(totalEmissions, "kg CO₂")}
          icon={<CloudIcon className="h-6 w-6" />}
          change={{
            value: 7.2,
            isPositive: false,
            isGood: true,
          }}
        />
        
        <StatCard 
          title="RENEWABLE ENERGY OFFSETS"
          value={formatWithUnit(totalOffsets, "kg CO₂")}
          icon={<ScaleIcon className="h-6 w-6" />}
          change={{
            value: 15.8,
            isPositive: true,
            isGood: true,
          }}
        />
        
        <StatCard 
          title="POTENTIAL REDUCTION"
          value={formatWithUnit(totalPotentialReduction, "tons CO₂/yr")}
          icon={<ArrowTrendingDownIcon className="h-6 w-6" />}
        />
      </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="EMISSIONS OVER TIME">
          <EmissionsChart data={emissionsData} timeframe={timeframe} />
        </Card>
        
        <Card title="EMISSIONS BY SOURCE">
          <EmissionsSourceChart data={calculateAverageSourceBreakdown()} />
        </Card>
      </div>
    
      <Card title="YOUR EMISSIONS VS. AVERAGE" className="mb-6">
        <EmissionsComparisonChart data={comparisons} />
      </Card>
 
      <Card title="EMISSIONS REDUCTION OPPORTUNITIES">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {reductionTips.map((tip) => (
            <div 
              key={tip.id} 
              className="bg-tertiary-dark rounded-lg p-4 border-l-4 border-green-500"
            >
              <h3 className="font-semibold text-white mb-2">{tip.title}</h3>
              <p className="text-gray-300 text-sm mb-3">{tip.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Potential Reduction</span>
                <span className="text-green-500 font-semibold">{tip.potentialReduction.toFixed(1)} tons CO₂/yr</span>
              </div>
              <div className="mt-3 flex items-center">
                <span className="text-xs mr-2 text-gray-400">Difficulty:</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  tip.difficulty === 'easy' 
                    ? 'bg-green-900 text-green-300' 
                    : tip.difficulty === 'medium'
                    ? 'bg-yellow-900 text-yellow-300'
                    : 'bg-red-900 text-red-300'
                }`}>
                  {tip.difficulty.charAt(0).toUpperCase() + tip.difficulty.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
     
      <Card title="EMISSIONS COMPARISON DETAILS">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Your Emissions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Average Emissions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {comparisons.map((item, index) => {
                const difference = ((item.yourEmissions - item.averageEmissions) / item.averageEmissions) * 100;
                
                return (
                  <tr key={index} className="hover:bg-tertiary-dark">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                      {item.yourEmissions.toFixed(1)} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                      {item.averageEmissions.toFixed(1)} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className={`inline-flex items-center ${
                        (difference < 0) ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {difference > 0 ? '+' : ''}{difference.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-tertiary-dark rounded-md text-sm text-gray-300">
          <p>
            <span className="font-medium text-white">Note:</span> Emissions calculations are based on regional average conversion factors and may vary based on your local energy mix and specific usage patterns.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Emissions;
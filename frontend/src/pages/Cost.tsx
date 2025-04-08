import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  LightBulbIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

import DashboardTabs from '../components/ui/DashboardTabs';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

import { 
  getCostBreakdown, 
  getCostProjections, 
  getCostSavingOpportunities 
} from '../services/energy';
import { 
  TimeFrame, 
  CostBreakdownItem, 
  CostProjection, 
  CostSavingOpportunity 
} from '../types/energy';

import CostBreakdownChart from '../components/charts/CostBreakdownChart';
import CostProjectionChart from '../components/charts/CostProjectionChart';

const Cost: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('month');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdownItem[]>([]);
  const [costProjections, setCostProjections] = useState<CostProjection[]>([]);
  const [savingOpportunities, setSavingOpportunities] = useState<CostSavingOpportunity[]>([]);
  
  
  const totalCost = costBreakdown.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalPotentialSavings = savingOpportunities.reduce((sum, item) => sum + (item.potentialSavings || 0), 0);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        
        const [breakdownData, projectionData, opportunitiesData] = await Promise.all([
          getCostBreakdown(timeframe),
          getCostProjections(),
          getCostSavingOpportunities()
        ]);
        
        
        const formattedBreakdown = breakdownData.map(item => ({
          ...item,
          percentage: item.percentage || parseFloat(((item.amount / 
            breakdownData.reduce((sum, bd) => sum + bd.amount, 0)) * 100).toFixed(1))
        }));
        
        setCostBreakdown(formattedBreakdown);
        setCostProjections(projectionData);
        setSavingOpportunities(opportunitiesData);
      } catch (err) {
        setError('Failed to load cost data. Please try again.');
        console.error('Error fetching cost data:', err);
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
  
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
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
        <h1 className="text-2xl font-semibold text-white">Energy Cost Analysis</h1>
      </div>
      
      <DashboardTabs 
        tabs={tabs}
        activeTab={timeframe}
        onChange={(tab) => setTimeframe(tab as TimeFrame)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="TOTAL ENERGY COST"
          value={formatCurrency(totalCost)}
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          change={{
            value: 4.2,
            isPositive: false,
            isGood: true,
          }}
        />
        
        <StatCard 
          title="AVERAGE DAILY COST"
          value={formatCurrency(totalCost / (timeframe === 'today' ? 1 : timeframe === 'month' ? 30 : 365))}
          icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
        />
        
        <StatCard 
          title="POTENTIAL SAVINGS"
          value={formatCurrency(totalPotentialSavings)}
          icon={<LightBulbIcon className="h-6 w-6" />}
          change={{
            value: 12.8,
            isPositive: true,
            isGood: true,
          }}
        />
      </div>
   
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="COST BREAKDOWN">
          {costBreakdown.length > 0 ? (
            <CostBreakdownChart data={costBreakdown} />
          ) : (
            <div className="h-64 flex items-center justify-center bg-tertiary-dark rounded-lg text-gray-400">
              No cost breakdown data available
            </div>
          )}
        </Card>
        
        <Card title="COST PROJECTIONS">
          {costProjections.length > 0 ? (
            <CostProjectionChart data={costProjections} />
          ) : (
            <div className="h-64 flex items-center justify-center bg-tertiary-dark rounded-lg text-gray-400">
              No projection data available
            </div>
          )}
        </Card>
      </div>
    
      <Card title="COST SAVING OPPORTUNITIES" className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {savingOpportunities.length > 0 ? (
            savingOpportunities.map((opportunity) => (
              <div 
                key={opportunity.id} 
                className="bg-tertiary-dark rounded-lg p-4 border-l-4 border-accent-teal"
              >
                <h3 className="font-semibold text-white mb-2">{opportunity.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{opportunity.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Potential Savings</span>
                  <span className="text-green-500 font-semibold">{formatCurrency(opportunity.potentialSavings)}/yr</span>
                </div>
                {opportunity.implementationCost !== undefined && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-400">Implementation Cost</span>
                    <span className="text-white">{formatCurrency(opportunity.implementationCost)}</span>
                  </div>
                )}
                {opportunity.paybackPeriod !== undefined && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-400">Payback Period</span>
                    <span className="text-white">{opportunity.paybackPeriod.toFixed(1)} years</span>
                  </div>
                )}
                <div className="mt-3 flex items-center">
                  <span className="text-xs mr-2 text-gray-400">Difficulty:</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    opportunity.difficulty === 'easy' 
                      ? 'bg-green-900 text-green-300' 
                      : opportunity.difficulty === 'medium'
                      ? 'bg-yellow-900 text-yellow-300'
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {opportunity.difficulty.charAt(0).toUpperCase() + opportunity.difficulty.slice(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-6 text-center text-gray-400">
              No cost saving opportunities available
            </div>
          )}
        </div>
      </Card>
      
      <Card title="DETAILED COST BREAKDOWN">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {costBreakdown.length > 0 ? (
                <>
                  {costBreakdown.map((item, index) => (
                    <tr key={index} className="hover:bg-tertiary-dark">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                        {item.percentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`inline-flex items-center ${
                          (item.change < 0) ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-tertiary-dark font-medium">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                      {formatCurrency(totalCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                      100%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                    No cost breakdown data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Cost;
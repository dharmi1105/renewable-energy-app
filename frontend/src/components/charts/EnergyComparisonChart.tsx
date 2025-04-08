import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { EnergyData, TimeFrame } from '../../types/energy';
import { parseISO, formatDateByTimeframe, formatDateForTooltip } from '../../utils/formatters';

interface EnergyComparisonChartProps {
  data: EnergyData[];
  timeframe: TimeFrame;
}

const EnergyComparisonChart: React.FC<EnergyComparisonChartProps> = ({ data, timeframe }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg text-gray-400">
        No data available for the selected time period
      </div>
    );
  }

  const processData = () => {
    let processedData = [...data];
    
    if (timeframe === 'month' && data.length > 31) {
      const dailyData: Record<string, any> = {};
      
      data.forEach(item => {
        try {
          const date = parseISO(item.timestamp);
          const dayKey = format(date, 'yyyy-MM-dd');
          
          if (!dailyData[dayKey]) {
            dailyData[dayKey] = {
              timestamp: dayKey,
              costs: {
                electricity: 0,
                gas: 0
              }
            };
          }
          
          dailyData[dayKey].costs.electricity += item.costs.electricity;
          dailyData[dayKey].costs.gas += item.costs.gas;
        } catch (e) {
          console.error('Error processing date:', e);
        }
      });
      
      processedData = Object.values(dailyData);
    } else if (timeframe === 'year' && data.length > 366) {
      const monthlyData: Record<string, any> = {};
      
      data.forEach(item => {
        try {
          const date = parseISO(item.timestamp);
          const monthKey = format(date, 'yyyy-MM');
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              timestamp: monthKey,
              costs: {
                electricity: 0,
                gas: 0
              }
            };
          }
          
          monthlyData[monthKey].costs.electricity += item.costs.electricity;
          monthlyData[monthKey].costs.gas += item.costs.gas;
        } catch (e) {
          console.error('Error processing date:', e);
        }
      });
      
      processedData = Object.values(monthlyData);
    }
    
    return processedData;
  };

  const chartData = processData();

  const formatXAxis = (timestamp: string) => {
    if (timestamp.length === 7) { 
      const [year, month] = timestamp.split('-');
      return `${year.slice(2)}-${month}`;
    } else if (timestamp.length === 10) { 
      const [year, month, day] = timestamp.split('-');
      return `${month}/${day}`;
    }
    
    return formatDateByTimeframe(timestamp, timeframe);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="timestamp" tickFormatter={formatXAxis} stroke="#9ca3af" />
        <YAxis 
          stroke="#9ca3af" 
          label={{ 
            value: 'Cost ($)', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#9ca3af' }
          }} 
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            borderColor: '#374151',
            color: 'white' 
          }}
          formatter={(value: string | number | (string | number)[]) => {
            if (typeof value === 'number') {
              return [`$${value.toFixed(2)}`, ''];
            } else if (Array.isArray(value)) {
              return value.map(v => (typeof v === 'number' ? `$${v.toFixed(2)}` : v));
            }
            return value;
          }}
          labelFormatter={(label) => {
            if (typeof label === 'string') {
              // Handle formatted strings
              if (label.length === 7 || label.length === 10) {
                return label;
              }
              return formatDateForTooltip(label);
            }
            return String(label);
          }}
        />
        <Legend />
        <Bar dataKey="costs.electricity" name="Electricity" fill="#5eead4" />
        <Bar dataKey="costs.gas" name="Gas" fill="#fde047" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EnergyComparisonChart;
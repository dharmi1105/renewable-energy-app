import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { EmissionsData, TimeFrame } from '../../types/energy';

interface EmissionsChartProps {
  data: EmissionsData[];
  timeframe: TimeFrame;
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({ data, timeframe }) => {
  const formatXAxis = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (timeframe === 'today') {
        return format(date, 'HH:mm');
      } else if (timeframe === 'month') {
        return format(date, 'dd');
      } else {
        return format(date, 'MMM');
      }
    } catch (e) {
      return timestamp;
    }
  };

  const formatTooltipLabel = (label: string) => {
    try {
      const date = new Date(label);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return label;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={formatXAxis} 
          stroke="#9ca3af"
        />
        <YAxis 
          stroke="#9ca3af"
          label={{ 
            value: 'kg CO₂', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#9ca3af' }
          }}
        />
        <Tooltip 
          labelFormatter={formatTooltipLabel}
          formatter={(value: any) => [parseFloat(value).toFixed(2) + ' kg CO₂', '']}
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            color: 'white'
          }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="carbonEmissions" 
          name="Gross Emissions" 
          stackId="1" 
          stroke="#ef4444" 
          fill="#ef4444" 
          fillOpacity={0.6} 
        />
        <Area 
          type="monotone" 
          dataKey="renewableOffsets" 
          name="Renewable Offsets" 
          stackId="2" 
          stroke="#10b981" 
          fill="#10b981" 
          fillOpacity={0.6} 
        />
        <Area 
          type="monotone" 
          dataKey="netEmissions" 
          name="Net Emissions" 
          stroke="#6366f1" 
          fill="#6366f1" 
          fillOpacity={0.6} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EmissionsChart;
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from 'recharts';

interface EfficiencyData {
  rating: string;
  consumption: number;
}

interface ApplianceEfficiencyChartProps {
  data: EfficiencyData[];
}

const ApplianceEfficiencyChart: React.FC<ApplianceEfficiencyChartProps> = ({ data }) => {
  const getColorForRating = (rating: string): string => {
    switch (rating) {
      case 'A+++': return '#059669'; 
      case 'A++': return '#10b981';
      case 'A+': return '#34d399';
      case 'A': return '#6ee7b7'; 
      case 'B': return '#fbbf24';
      case 'C': return '#f59e0b';
      case 'D': return '#f97316';
      case 'E': return '#ef4444';
      case 'F': return '#b91c1c';
      default: return '#6b7280';
    }
  };
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          type="number" 
          tick={{ fill: '#9ca3af' }}
          stroke="#4b5563" 
        />
        <YAxis 
          type="category"
          dataKey="rating"
          tick={{ fill: '#9ca3af' }}
          stroke="#4b5563"
          width={60}
        />
        <Tooltip 
          formatter={(value: any) => [`${value.toFixed(2)} kWh`, 'Consumption']}
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            color: 'white'
          }}
        />
        <Bar dataKey="consumption" name="Energy Consumption">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColorForRating(entry.rating)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ApplianceEfficiencyChart;
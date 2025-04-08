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
import { EmissionsComparison } from '../../types/energy';

interface EmissionsComparisonChartProps {
  data: EmissionsComparison[];
}

const EmissionsComparisonChart: React.FC<EmissionsComparisonChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="category" 
          tick={{ fill: '#9ca3af' }}
          stroke="#4b5563"
        />
        <YAxis 
          tick={{ fill: '#9ca3af' }}
          stroke="#4b5563"
        />
        <Tooltip 
          formatter={(value: any, name: string, props: any) => {
            const unit = props.payload.unit || '';
            return [`${value.toFixed(2)} ${unit}`, name === 'yourEmissions' ? 'Your Emissions' : 'Average Emissions'];
          }}
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            color: 'white'
          }}
        />
        <Legend 
          formatter={(value) => (value === 'yourEmissions' ? 'Your Emissions' : 'Average Emissions')}
        />
        <Bar dataKey="yourEmissions" fill="#10b981" name="yourEmissions" />
        <Bar dataKey="averageEmissions" fill="#6366f1" name="averageEmissions" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EmissionsComparisonChart;
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface EmissionsSourceChartProps {
  data: { name: string; value: number }[] | null;
}

const EmissionsSourceChart: React.FC<EmissionsSourceChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg text-gray-400">
        No emissions data available
      </div>
    );
  }

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#10b981'];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percentage }) => `${name}: ${percentage}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any) => [parseFloat(value).toFixed(2) + ' kg CO₂', '']}
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            color: 'white'
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EmissionsSourceChart;
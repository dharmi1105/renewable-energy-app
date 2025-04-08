import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { CostBreakdownItem } from '../../types/energy';

interface CostBreakdownChartProps {
  data: CostBreakdownItem[];
}


const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg text-gray-400">
        No cost breakdown data available
      </div>
    );
  }

  
  const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ec4899', '#8b5cf6', '#6366f1'];

  
  const formatTooltip = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={110}
          fill="#8884d8"
          dataKey="amount"
          label={({ name, percentage }) => {
            if (typeof name === 'string' && typeof percentage === 'number') {
              return `${name}: ${percentage.toFixed(1)}%`;
            }
            return '';
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={formatTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CostBreakdownChart;
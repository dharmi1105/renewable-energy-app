import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CostProjection } from '../../types/energy';

interface CostProjectionChartProps {
  data: CostProjection[];
}

const CostProjectionChart: React.FC<CostProjectionChartProps> = ({ data }) => {
  const formatTooltip = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="middle" 
          fill="#9ca3af"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
        <XAxis 
          dataKey="month"
          tick={<CustomXAxisTick />}
          stroke="#4b5563"  
        />
        <YAxis 
          tick={{ fill: '#9ca3af' }}
          stroke="#4b5563"
          label={{ 
            value: 'Cost ($)', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#9ca3af' }
          }}
        />
        <Tooltip 
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            color: 'white'
          }}
        />
        <Legend wrapperStyle={{ color: '#9ca3af' }} />
        <Bar 
          dataKey="actual" 
          name="Actual Cost" 
          fill="#3b82f6" 
          barSize={20} 
        />
        <Line 
          type="monotone" 
          dataKey="projected" 
          name="Projected Cost" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CostProjectionChart;
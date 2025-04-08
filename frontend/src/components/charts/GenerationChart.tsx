import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { EnergyData, TimeFrame } from '../../types/energy';

interface GenerationChartProps {
  data: EnergyData[];
  timeframe: TimeFrame;
}

const GenerationChart: React.FC<GenerationChartProps> = ({ data, timeframe }) => {
  
  const totalSolar = data.reduce((sum, item) => sum + (item.generation?.solar || 0), 0);
  const totalWind = data.reduce((sum, item) => sum + (item.generation?.wind || 0), 0);
  const totalHydro = data.reduce((sum, item) => sum + (item.generation?.hydro || 0), 0);
  
  
  const generationData = [
    { name: 'Solar', value: totalSolar },
    { name: 'Wind', value: totalWind },
    { name: 'Hydro', value: totalHydro },
  ];
  
  
  const COLORS = ['#eab308', '#22c55e', '#06b6d4'];

  
  const total = totalSolar + totalWind + totalHydro;
  const dataWithPercent = generationData.map(item => ({
    ...item,
    percent: ((item.value / (total || 1)) * 100).toFixed(1)
  }));

  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg text-gray-400">
        No generation data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dataWithPercent}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${percent}%`}
        >
          {dataWithPercent.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => 
            typeof value === 'number' ? [`${value.toFixed(1)} kWh`, ''] : [value, '']
          }
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

export default GenerationChart;
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ApplianceData } from '../../types/energy';

interface ApplianceTimeChartProps {
  appliance: ApplianceData | undefined;
}

const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={16} 
        textAnchor="end" 
        fill="#9ca3af"
        transform="rotate(-45)"
      >
        {payload.value}
      </text>
    </g>
  );
};

const ApplianceTimeChart: React.FC<ApplianceTimeChartProps> = ({ appliance }) => {
  if (!appliance) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg text-gray-400">
        No appliance data available
      </div>
    );
  }
  
  const parseTimeRanges = () => {
    const hourlyUsage = Array(24).fill(0);
    
    if (appliance.timeOfUse) {
      appliance.timeOfUse.forEach(range => {
        if (range === 'Various') {
          hourlyUsage.forEach((_, index) => {
            hourlyUsage[index] = 0.3;
          });
          return;
        }
        
        const match = range.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
        if (match) {
          const startHour = parseInt(match[1]);
          const endHour = parseInt(match[3]);
 
          for (let hour = startHour; hour < endHour; hour++) {
            hourlyUsage[hour] = 1;
          }
        }
      });
    }

    return hourlyUsage.map((value, hour) => ({
      hour: hour.toString().padStart(2, '0') + ':00',
      usage: value === 1 ? appliance.consumption / (appliance.usageHours || 1) : 0
    }));
  };

  const chartData = parseTimeRanges();
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 70,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="hour" 
          tick={<CustomTick />}
          height={60}
          stroke="#4b5563"
        />
        <YAxis 
          tick={{ fill: '#9ca3af' }}
          stroke="#4b5563"
          label={{ 
            value: 'kWh', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#9ca3af' }
          }}
        />
        <Tooltip 
          formatter={(value: any) => [`${value.toFixed(2)} kWh`, 'Usage']}
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            color: 'white'
          }}
        />
        <Bar dataKey="usage" name="Energy Usage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ApplianceTimeChart;
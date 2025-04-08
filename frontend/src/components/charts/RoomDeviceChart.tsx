import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface DeviceData {
  deviceId: string;
  deviceName: string;
  consumption: number;
  percentage: number;
}

interface RoomDeviceChartProps {
  data: DeviceData[];
}

const RoomDeviceChart: React.FC<RoomDeviceChartProps> = ({ data }) => {
  
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg text-gray-400">
        No device data available
      </div>
    );
  }

  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#6366f1'];

  
  const chartData = data.map(device => ({
    name: device.deviceName,
    value: device.consumption,
    percentage: device.percentage
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
          label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any) => [`${value.toFixed(2)} kWh`, '']}
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

export default RoomDeviceChart;
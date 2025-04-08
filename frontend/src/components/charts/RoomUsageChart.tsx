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
import { RoomUsageData } from '../../types/energy';

interface RoomUsageChartProps {
  data: RoomUsageData[];
  onRoomClick: (roomId: string) => void;
  selectedRoom: string | null;
}

const RoomUsageChart: React.FC<RoomUsageChartProps> = ({ 
  data, 
  onRoomClick,
  selectedRoom 
}) => {
  
  const chartData = data.map(room => ({
    roomId: room.roomId,
    name: room.roomName,
    consumption: room.consumption,
    percentage: room.percentage,
    selected: room.roomId === selectedRoom
  }));

  
  const renderCustomBar = (props: any) => {
    const { x, y, width, height, fill, roomId, selected } = props;
    
    return (
      <g>
        <rect 
          x={x} 
          y={y} 
          width={width} 
          height={height} 
          fill={selected ? '#10b981' : fill}
          stroke={selected ? '#fff' : 'none'}
          strokeWidth={selected ? 2 : 0}
          rx={4}
          ry={4}
          cursor="pointer"
          onClick={() => onRoomClick(roomId)}
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#9ca3af' }}
        />
        <YAxis 
          label={{ 
            value: 'kWh', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#9ca3af' }
          }}
          tick={{ fill: '#9ca3af' }}
        />
        <Tooltip 
          formatter={(value: any, name: string) => {
            if (name === 'consumption') {
              return [`${value.toFixed(1)} kWh`, 'Consumption'];
            }
            return [value, name];
          }}
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            color: 'white'
          }}
        />
        <Legend />
        <Bar 
          dataKey="consumption" 
          name="Energy Consumption" 
          fill="#3b82f6" 
          shape={renderCustomBar}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RoomUsageChart;
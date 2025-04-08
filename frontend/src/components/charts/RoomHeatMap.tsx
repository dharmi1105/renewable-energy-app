import React from 'react';
import { RoomUsageData } from '../../types/energy';

interface RoomHeatMapProps {
  roomData: RoomUsageData[];
  selectedRoom: string | null;
}

const RoomHeatMap: React.FC<RoomHeatMapProps> = ({ roomData, selectedRoom }) => {
  
  const currentRoom = selectedRoom 
    ? roomData.find(room => room.roomId === selectedRoom) 
    : roomData.length > 0 ? roomData[0] : null;

  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  
  const generateHeatMapData = () => {
    if (!currentRoom) return Array(24).fill(0);
    
    
    const heatMap = Array(24).fill(0);
    
    
    if (currentRoom.peakHours && Array.isArray(currentRoom.peakHours)) {
      currentRoom.peakHours.forEach(hour => {
        if (hour >= 0 && hour < 24) {
          heatMap[hour] = 1; 
        }
      });
    }
    
    return heatMap;
  };
  
  const heatMapData = generateHeatMapData();
  
  
  const getColor = (value: number) => {
    if (value >= 0.8) return 'bg-red-500';
    if (value >= 0.5) return 'bg-orange-500';
    if (value >= 0.2) return 'bg-yellow-500';
    if (value > 0) return 'bg-green-500';
    return 'bg-gray-700';
  };
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">
          {currentRoom ? `Peak usage hours for ${currentRoom.roomName}` : 'No room selected'}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
            <span className="text-xs text-gray-400">Low</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-sm mr-1"></div>
            <span className="text-xs text-gray-400">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-sm mr-1"></div>
            <span className="text-xs text-gray-400">High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
            <span className="text-xs text-gray-400">Peak</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-1">
        {hours.map(hour => (
          <div key={hour} className="flex flex-col items-center">
            <div className={`w-full h-8 ${getColor(heatMapData[hour])} rounded`}></div>
            <div className="text-xs text-gray-400 mt-1">{hour}:00</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <div className="text-sm text-white">
          {currentRoom?.peakHours && Array.isArray(currentRoom.peakHours) && currentRoom.peakHours.length > 0
            ? `This room has ${currentRoom.peakHours.length} peak usage hour${currentRoom.peakHours.length > 1 ? 's' : ''}`
            : 'No peak hours data available'
          }
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Usage patterns can help identify opportunities for energy optimization.
        </div>
      </div>
    </div>
  );
};

export default RoomHeatMap;
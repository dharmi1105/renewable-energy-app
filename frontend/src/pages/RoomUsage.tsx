import React, { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  FireIcon, 
  LightBulbIcon 
} from '@heroicons/react/24/outline';

import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

import { 
  getRoomUsageData, 
  getRoomEfficiencyTips
} from '../services/energy';
import { 
  RoomUsageData, 
  RoomEfficiencyTip 
} from '../types/energy';


import RoomUsageChart from '../components/charts/RoomUsageChart';
import RoomDeviceChart from '../components/charts/RoomDeviceChart';
import RoomHeatMap from '../components/charts/RoomHeatMap';

const RoomUsage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [roomData, setRoomData] = useState<RoomUsageData[]>([]);
  const [efficiencyTips, setEfficiencyTips] = useState<RoomEfficiencyTip[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  
  const selectedRoomData = selectedRoom 
    ? roomData.find(room => room.roomId === selectedRoom) 
    : roomData.length > 0 ? roomData[0] : null;
    
  
  const selectedRoomTips = selectedRoom && efficiencyTips.length > 0
    ? efficiencyTips.filter(tip => tip.roomId === selectedRoom)
    : roomData.length > 0 && efficiencyTips.length > 0
      ? efficiencyTips.filter(tip => tip.roomId === roomData[0]?.roomId)
      : [];
  
  
  const totalConsumption = roomData.reduce((sum, room) => sum + room.consumption, 0);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        
        const [rooms, tips] = await Promise.all([
          getRoomUsageData(),
          getRoomEfficiencyTips()
        ]);
        
        if (rooms.length > 0) {
          setRoomData(rooms);
          setEfficiencyTips(tips);
          
          
          if (!selectedRoom) {
            setSelectedRoom(rooms[0].roomId);
          }
        } else {
          setError('No room data available');
        }
      } catch (err) {
        setError('Failed to load room usage data. Please try again.');
        console.error('Error fetching room data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  
  const formatEnergy = (value: number) => {
    return `${value.toFixed(1)} kWh`;
  };
  
  if (isLoading) {
    return (
      <div className="py-6 px-8 ml-60 flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-6 px-8 ml-60">
        <ErrorAlert message={error} />
      </div>
    );
  }

  return (
    <div className="py-6 px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Room Energy Usage</h1>
      </div>
     
      <div className="bg-tertiary-dark rounded-lg p-1 mb-6 flex overflow-x-auto">
        {roomData.map((room) => (
          <button
            key={room.roomId}
            className={`
              px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap
              ${selectedRoom === room.roomId 
                ? 'bg-secondary-dark text-white' 
                : 'text-gray-400 hover:text-white'}
            `}
            onClick={() => setSelectedRoom(room.roomId)}
          >
            {room.roomName}
          </button>
        ))}
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="TOTAL HOME CONSUMPTION"
          value={formatEnergy(totalConsumption)}
          icon={<HomeIcon className="h-6 w-6" />}
        />
        
        <StatCard 
          title={`${selectedRoomData?.roomName?.toUpperCase() || ''} CONSUMPTION`}
          value={formatEnergy(selectedRoomData?.consumption || 0)}
          icon={<FireIcon className="h-6 w-6" />}
          change={{
            value: selectedRoomData?.percentage || 0,
            isPositive: true,
            isGood: false,
          }}
        />
        
        <StatCard 
          title="AVERAGE ROOM TEMPERATURE"
          value={`${selectedRoomData?.temperature?.toFixed(1) || '0.0'}°C`}
          icon={<LightBulbIcon className="h-6 w-6" />}
        />
      </div>
   
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="ENERGY USAGE BY ROOM" className="lg:col-span-2">
          {roomData.length > 0 ? (
            <RoomUsageChart 
              data={roomData} 
              onRoomClick={(roomId) => setSelectedRoom(roomId)} 
              selectedRoom={selectedRoom}
            />
          ) : (
            <div className="h-64 flex items-center justify-center bg-tertiary-dark rounded-lg text-gray-400">
              No room usage data available
            </div>
          )}
        </Card>
        
        <Card title={`${selectedRoomData?.roomName?.toUpperCase() || ''} DEVICES`}>
          {selectedRoomData && selectedRoomData.devices && selectedRoomData.devices.length > 0 ? (
            <RoomDeviceChart data={selectedRoomData.devices} />
          ) : (
            <div className="h-64 flex items-center justify-center bg-tertiary-dark rounded-lg text-gray-400">
              No device data available
            </div>
          )}
        </Card>
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="USAGE PATTERN BY HOUR">
          {roomData.length > 0 ? (
            <RoomHeatMap roomData={roomData} selectedRoom={selectedRoom} />
          ) : (
            <div className="h-64 flex items-center justify-center bg-tertiary-dark rounded-lg text-gray-400">
              No usage pattern data available
            </div>
          )}
        </Card>
        
        <Card title="EFFICIENCY RECOMMENDATIONS">
          <div className="space-y-4">
            {selectedRoomTips.length > 0 ? (
              selectedRoomTips.map((tip) => (
                <div 
                  key={tip.tipId} 
                  className="bg-tertiary-dark rounded-lg p-4 border-l-4 border-green-500"
                >
                  <h3 className="font-semibold text-white mb-2">{tip.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{tip.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Potential Savings</span>
                    <span className="text-green-500 font-semibold">${tip.potentialSavings.toFixed(2)}/yr</span>
                  </div>
                  <div className="mt-3 flex items-center">
                    <span className="text-xs mr-2 text-gray-400">Difficulty:</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      tip.difficulty === 'easy' 
                        ? 'bg-green-900 text-green-300' 
                        : tip.difficulty === 'medium'
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {tip.difficulty.charAt(0).toUpperCase() + tip.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-6">
                No recommendations available for this room.
              </div>
            )}
          </div>
        </Card>
      </div>
     
      <Card title={`${selectedRoomData?.roomName?.toUpperCase() || ''} DETAILS`}>
        {selectedRoomData && selectedRoomData.devices && selectedRoomData.devices.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Consumption
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Recommendations
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {selectedRoomData.devices.map((device) => {
                    
                    const relatedTip = selectedRoomTips.find(tip => 
                      tip.title.toLowerCase().includes(device.deviceName.toLowerCase())
                    );
                    
                    return (
                      <tr key={device.deviceId} className="hover:bg-tertiary-dark">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {device.deviceName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                          {device.consumption.toFixed(1)} kWh
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                          {device.percentage.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {relatedTip ? (
                            <span className="text-green-500 text-xs px-2 py-1 bg-green-900 bg-opacity-50 rounded">
                              Available
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs px-2 py-1 bg-gray-800 rounded">
                              None
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          
            {selectedRoomData && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-tertiary-dark rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Peak Usage Hours</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoomData.peakHours && selectedRoomData.peakHours.length > 0 ? (
                      selectedRoomData.peakHours.map((hour) => (
                        <span 
                          key={hour} 
                          className="inline-block px-2 py-1 text-xs font-medium bg-blue-900 text-blue-300 rounded"
                        >
                          {hour < 10 ? `0${hour}` : hour}:00
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">No peak hours data available</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-tertiary-dark rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Room Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Temperature</span>
                      <span className="text-white text-sm">{selectedRoomData.temperature?.toFixed(1) || 'N/A'}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Occupancy Rate</span>
                      <span className="text-white text-sm">{(selectedRoomData.occupancyRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Energy per Hour</span>
                      <span className="text-white text-sm">
                        {(selectedRoomData.consumption / 
                          Math.max(1, (selectedRoomData.peakHours?.length || 1))).toFixed(2)} kWh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-6 text-center text-gray-400">
            No device data available for this room.
          </div>
        )}
      </Card>
    </div>
  );
};

export default RoomUsage;
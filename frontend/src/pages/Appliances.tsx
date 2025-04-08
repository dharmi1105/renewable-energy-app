import React, { useState, useEffect } from 'react';
import { 
  LightBulbIcon, 
  ClockIcon, 
  BoltIcon 
} from '@heroicons/react/24/outline';

import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

import { getDetailedApplianceData } from '../services/energy';
import { ApplianceData } from '../types/energy';


import ApplianceUsage from '../components/dashboard/ApplianceUsage';
import ApplianceEfficiencyChart from '../components/charts/ApplianceEfficiencyChart';
import ApplianceTimeChart from '../components/charts/ApplianceTimeChart';

const Appliances: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appliances, setAppliances] = useState<ApplianceData[]>([]);
  const [selectedAppliance, setSelectedAppliance] = useState<string | null>(null);
  
  
  const totalConsumption = appliances.reduce((sum, appliance) => sum + appliance.consumption, 0);
  const totalStandbyPower = appliances.reduce((sum, appliance) => sum + (appliance.standbyPower || 0), 0);
  
  
  const selectedApplianceData = selectedAppliance 
    ? appliances.find(app => app.id === selectedAppliance) 
    : appliances[0];
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        
        const data = await getDetailedApplianceData();
        setAppliances(data);
        
        
        if (data.length > 0 && !selectedAppliance) {
          setSelectedAppliance(data[0].id);
        }
      } catch (err) {
        setError('Failed to load appliance data. Please try again.');
        console.error('Error fetching appliance data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  
  const getAppliancesByEfficiency = () => {
    const grouped: Record<string, number> = {};
    
    appliances.forEach(appliance => {
      const efficiency = appliance.energyEfficiency || 'Unknown';
      grouped[efficiency] = (grouped[efficiency] || 0) + appliance.consumption;
    });
    
    return Object.entries(grouped).map(([rating, consumption]) => ({
      rating,
      consumption
    })).sort((a, b) => {
      
      const ratingOrder: Record<string, number> = {
        'A+++': 1, 'A++': 2, 'A+': 3, 'A': 4, 'B': 5, 'C': 6, 'D': 7, 
        'E': 8, 'F': 9, 'Unknown': 10
      };
      return (ratingOrder[a.rating] || 100) - (ratingOrder[b.rating] || 100);
    });
  };
  
  
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
        <h1 className="text-2xl font-semibold text-white">Appliance Energy Analysis</h1>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="TOTAL APPLIANCE CONSUMPTION"
          value={formatEnergy(totalConsumption)}
          icon={<BoltIcon className="h-6 w-6" />}
        />
        
        <StatCard 
          title="STANDBY POWER WASTE"
          value={formatEnergy(totalStandbyPower * 24)} 
          icon={<LightBulbIcon className="h-6 w-6" />}
          change={{
            value: (totalStandbyPower * 24 / totalConsumption) * 100,
            isPositive: true,
            isGood: false,
          }}
        />
        
        <StatCard 
          title="AVERAGE DAILY USAGE"
          value={`${appliances.reduce((sum, app) => sum + (app.usageHours || 0), 0) / appliances.length} hours`}
          icon={<ClockIcon className="h-6 w-6" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="ENERGY CONSUMPTION BY APPLIANCE" className="lg:col-span-2">
          <ApplianceUsage appliances={appliances} />
        </Card>
     
        <Card title="ENERGY EFFICIENCY RATINGS">
          <ApplianceEfficiencyChart data={getAppliancesByEfficiency()} />
        </Card>
      </div>
     
      <div className="bg-tertiary-dark rounded-lg p-1 mb-6 flex overflow-x-auto">
        {appliances.map((appliance) => (
          <button
            key={appliance.id}
            className={`
              px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap
              ${selectedAppliance === appliance.id 
                ? 'bg-secondary-dark text-white' 
                : 'text-gray-400 hover:text-white'}
            `}
            onClick={() => setSelectedAppliance(appliance.id)}
          >
            {appliance.name}
          </button>
        ))}
      </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title={`${selectedApplianceData?.name.toUpperCase() || ''} USAGE TIMES`}>
          <ApplianceTimeChart appliance={selectedApplianceData} />
        </Card>
     
        <Card title={`${selectedApplianceData?.name.toUpperCase() || ''} DETAILS`}>
          {selectedApplianceData && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-tertiary-dark rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Energy Consumption</h3>
                  <p className="text-2xl font-bold text-white">{selectedApplianceData.consumption} {selectedApplianceData.unit}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {((selectedApplianceData.consumption / totalConsumption) * 100).toFixed(1)}% of total
                  </p>
                </div>
                
                <div className="bg-tertiary-dark rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Energy Efficiency</h3>
                  <p className="text-2xl font-bold text-white">{selectedApplianceData.energyEfficiency || 'N/A'}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedApplianceData.energyEfficiency ? 'EU Energy Rating' : 'Not rated'}
                  </p>
                </div>
              </div>
         
              <div className="bg-tertiary-dark rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Usage Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Daily Usage:</span>
                    <span className="text-white font-medium">{selectedApplianceData.usageHours || 0} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Standby Power:</span>
                    <span className="text-white font-medium">{selectedApplianceData.standbyPower || 0} kWh</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Common Usage Times:</span>
                    <span className="text-white font-medium">
                      {selectedApplianceData.timeOfUse?.join(', ') || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
          
              <div className="bg-tertiary-dark rounded-lg p-4 border-l-4 border-accent-teal">
                <h3 className="text-sm font-medium text-white mb-2">Energy Saving Recommendations</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {selectedApplianceData.name === "Refrigerator" && (
                    <>
                      <li>• Keep temperature at 38°F for refrigerator and 0°F for freezer</li>
                      <li>• Ensure door seals are tight and clean coils regularly</li>
                      <li>• Keep the refrigerator full but not overcrowded</li>
                    </>
                  )}
                  {selectedApplianceData.name === "Washer & Dryer" && (
                    <>
                      <li>• Wash full loads using cold water when possible</li>
                      <li>• Clean lint trap before each dryer use</li>
                      <li>• Consider air drying clothes when possible</li>
                    </>
                  )}
                  {selectedApplianceData.name === "Heating & AC" && (
                    <>
                      <li>• Use a programmable thermostat to optimize temperature</li>
                      <li>• Change filters regularly</li>
                      <li>• Use ceiling fans to improve air circulation</li>
                    </>
                  )}
                  {selectedApplianceData.name === "Lighting" && (
                    <>
                      <li>• Replace any remaining incandescent bulbs with LEDs</li>
                      <li>• Install motion sensors or timers in less frequently used areas</li>
                      <li>• Maximize natural light during daytime hours</li>
                    </>
                  )}
                  {selectedApplianceData.name === "Water Heater" && (
                    <>
                      <li>• Lower water heater temperature to 120°F</li>
                      <li>• Insulate water heater and hot water pipes</li>
                      <li>• Install low-flow fixtures to reduce hot water usage</li>
                    </>
                  )}
                  {!["Refrigerator", "Washer & Dryer", "Heating & AC", "Lighting", "Water Heater"].includes(selectedApplianceData.name) && (
                    <>
                      <li>• Use smart plugs to eliminate standby power</li>
                      <li>• Operate during off-peak hours when possible</li>
                      <li>• Consider upgrading to more energy-efficient models</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
  
      <Card title="ALL APPLIANCES">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Appliance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Consumption
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Standby Power
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Daily Usage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {appliances.map((appliance) => (
                <tr 
                  key={appliance.id} 
                  className={`hover:bg-tertiary-dark cursor-pointer ${
                    selectedAppliance === appliance.id ? 'bg-tertiary-dark' : ''
                  }`}
                  onClick={() => setSelectedAppliance(appliance.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {appliance.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                    {appliance.consumption} {appliance.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      appliance.energyEfficiency?.startsWith('A') 
                        ? 'bg-green-900 text-green-300' 
                        : appliance.energyEfficiency === 'B'
                        ? 'bg-teal-900 text-teal-300'
                        : appliance.energyEfficiency === 'C'
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {appliance.energyEfficiency || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                    {appliance.standbyPower ? `${appliance.standbyPower} kWh` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                    {appliance.usageHours ? `${appliance.usageHours} h` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Appliances;
import React from 'react';
import { ApplianceData } from '../../types/energy';

interface ApplianceUsageProps {
  appliances: ApplianceData[];
}

const ApplianceUsage: React.FC<ApplianceUsageProps> = ({ appliances }) => {
  
  if (!appliances || appliances.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg text-gray-400">
        No appliance data available
      </div>
    );
  }

  
  const sortedAppliances = [...appliances].sort((a, b) => b.consumption - a.consumption);


  const totalConsumption = sortedAppliances.reduce((sum, app) => sum + app.consumption, 0);
  
  
  const appliancesWithPercentage = sortedAppliances.map(appliance => ({
    ...appliance,
    percentage: (appliance.consumption / totalConsumption) * 100
  }));
  

  const top3Percentage = appliancesWithPercentage
    .slice(0, 3)
    .reduce((sum, app) => sum + app.percentage, 0);

  return (
    <div className="space-y-4">
      {appliancesWithPercentage.map((appliance) => (
        <div key={appliance.id} className="flex items-center">
          <div className="w-36 mr-4 text-gray-300">{appliance.name}</div>
          <div className="flex-1">
            <div className="h-3 bg-tertiary-dark rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${appliance.percentage}%` }}
              />
            </div>
          </div>
          <div className="ml-4 text-white font-medium w-24 text-right">
            {appliance.consumption} {appliance.unit}
          </div>
        </div>
      ))}
      
      <div className="text-sm text-gray-400 mt-4">
        Top 3 appliances make up {top3Percentage.toFixed(1)}% of the total usage.
      </div>
    </div>
  );
};

export default ApplianceUsage;
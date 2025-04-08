import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
    isGood: boolean;
  };
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  return (
    <div className="bg-secondary-dark rounded-lg p-4 shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
          <div className="text-white text-2xl font-bold">{value}</div>
        </div>
        {icon && (
          <div className="p-2 rounded-full bg-tertiary-dark text-accent-teal">
            {icon}
          </div>
        )}
      </div>
      
      {change && (
        <div className="mt-2 flex items-center">
          {change.isPositive ? (
            <ArrowUpIcon 
              className={`h-4 w-4 ${change.isGood ? 'text-green-500' : 'text-red-500'}`} 
            />
          ) : (
            <ArrowDownIcon 
              className={`h-4 w-4 ${change.isGood ? 'text-green-500' : 'text-red-500'}`} 
            />
          )}
          <span 
            className={`ml-1 text-sm ${
              change.isGood ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {change.value.toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
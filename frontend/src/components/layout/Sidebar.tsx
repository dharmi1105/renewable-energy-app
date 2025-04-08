import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  BuildingOfficeIcon,
  CloudIcon,
  DocumentTextIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  
  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
    { path: '/cost', label: 'Cost Analysis', icon: <CurrencyDollarIcon className="w-5 h-5" /> },
    { path: '/appliances', label: 'Appliances', icon: <LightBulbIcon className="w-5 h-5" /> },
    { path: '/usage-by-rooms', label: 'Room Usage', icon: <BuildingOfficeIcon className="w-5 h-5" /> },
    { path: '/emissions', label: 'Emissions', icon: <CloudIcon className="w-5 h-5" /> },
  ];

  const goToHome = () => {
    navigate('/dashboard');
  };

  const handleUnimplementedClick = (feature: string) => {
    alert(`The ${feature} feature is not yet implemented.`);
  };

  return (
    <div className={`bg-gray-900 h-screen overflow-y-auto text-white ${isCollapsed ? 'w-20' : 'w-60'}`}>
      <div 
        className="px-6 py-6 cursor-pointer"
        onClick={goToHome}
      >
        <h1 className="text-xl font-bold text-white">
          {isCollapsed ? "RE" : "RENEWABLE ENERGY"}
        </h1>
      </div>

      <div className="mt-2 mb-6 mx-6">
        <div className="bg-gray-800 rounded-md p-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {!isCollapsed && <span className="text-xs ml-2 text-gray-300">System Status: Online</span>}
          </div>
        </div>
      </div>

      <nav className="mt-2">
        {!isCollapsed && (
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 tracking-wider uppercase">
            Main Navigation
          </div>
        )}
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => `
                  flex items-center ${!isCollapsed ? 'px-4 py-3 mx-2' : 'px-0 py-3 mx-0 justify-center'} text-sm text-gray-300 rounded-md
                  transition-colors duration-200
                  ${isActive 
                    ? 'text-white bg-gray-800 border-l-2 border-blue-500' 
                    : 'hover:bg-gray-800 hover:text-white'}
                `}
                title={link.label}
              >
                <span className={!isCollapsed ? "mr-3 text-gray-400" : "text-gray-400"}>{link.icon}</span>
                {!isCollapsed && <span>{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
        
        {!isCollapsed && (
          <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-400 tracking-wider uppercase">
            Reports
          </div>
        )}
        <ul className="space-y-1 mt-2">
          <li>
            <button 
              className={`flex items-center ${!isCollapsed ? 'px-4 py-3 mx-2 text-left' : 'px-0 py-3 mx-0 justify-center'} text-sm text-gray-300 rounded-md hover:bg-gray-800 hover:text-white w-full`}
              onClick={() => handleUnimplementedClick('Monthly Report')}
              title="Monthly Report"
            >
              <span className={!isCollapsed ? "mr-3 text-gray-400" : "text-gray-400"}>
                <DocumentTextIcon className="w-5 h-5" />
              </span>
              {!isCollapsed && <span>Monthly Report</span>}
            </button>
          </li>
          <li>
            <button 
              className={`flex items-center ${!isCollapsed ? 'px-4 py-3 mx-2 text-left' : 'px-0 py-3 mx-0 justify-center'} text-sm text-gray-300 rounded-md hover:bg-gray-800 hover:text-white w-full`}
              onClick={() => handleUnimplementedClick('Analytics')}
              title="Analytics"
            >
              <span className={!isCollapsed ? "mr-3 text-gray-400" : "text-gray-400"}>
                <ChartPieIcon className="w-5 h-5" />
              </span>
              {!isCollapsed && <span>Analytics</span>}
            </button>
          </li>
        </ul>
      </nav>
      
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-800 rounded-md p-3">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs ml-2 text-gray-300">System Version: 1.2.0</span>
            </div>
            <div className="text-xs text-gray-400">
              Last updated: April 7, 2025
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { 
  BellIcon, 
  SunIcon, 
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../services/auth';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { authState } = useAuth();
  const location = useLocation();
  const currentDate = format(new Date(), 'MMMM yyyy');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/cost')) return 'Energy Cost Analysis';
    if (path.includes('/appliances')) return 'Appliances Analysis';
    if (path.includes('/usage-by-rooms') || path.includes('/room')) return 'Room Usage';
    if (path.includes('/emissions')) return 'Carbon Emissions';
    return 'Energy Dashboard';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = () => {
    logout();
  }

  return (
    <div className="h-16 flex items-center justify-between bg-gray-800 px-4 border-b border-gray-700">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white focus:outline-none mr-3"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h1 className="text-xl font-medium text-white">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center space-x-4" ref={dropdownRef}>
        <span className="text-gray-400">{currentDate}</span>
        
        <a 
          href="/dashboard"
          className="p-2 text-gray-400 hover:text-white focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </a>
        
        <div className="relative">
          <button 
            className="p-2 text-gray-400 hover:text-white focus:outline-none"
            onClick={() => toggleDropdown('settings')}
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
          
          {openDropdown === 'settings' && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-50 py-1">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
                General Settings
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
                Appearance
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
                Data Preferences
              </button>
            </div>
          )}
        </div>
        
        <button className="p-2 text-gray-400 hover:text-white focus:outline-none">
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </button>
 
        <div className="relative">
          <button 
            className="p-2 text-gray-400 hover:text-white focus:outline-none"
            onClick={() => toggleDropdown('notifications')}
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          {openDropdown === 'notifications' && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-700 rounded-md shadow-lg z-50 py-1">
              <div className="px-4 py-2 border-b border-gray-600">
                <h3 className="text-sm font-medium text-white">Notifications</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-600">
                  <p className="text-sm text-white">Energy usage spike detected</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-600">
                  <p className="text-sm text-white">Solar panels performing above average today</p>
                  <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
 
        <button className="p-2 text-gray-400 hover:text-white focus:outline-none">
          <SunIcon className="h-5 w-5" />
        </button>
   
        <div className="relative">
          <button 
            className="flex items-center text-sm text-gray-300 hover:text-white focus:outline-none"
            onClick={() => toggleDropdown('user')}
          >
            <UserCircleIcon className="h-8 w-8 mr-1" />
            <span>{authState.user?.username || 'demo'}</span>
          </button>
          
          {openDropdown === 'user' && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-50 py-1">
              <div className="px-4 py-3 border-b border-gray-600">
                <p className="text-sm font-medium text-white">{authState.user?.username || 'demo'}</p>
                <p className="text-xs text-gray-400 truncate">{authState.user?.email || 'demo@example.com'}</p>
              </div>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
                Profile Settings
              </button>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
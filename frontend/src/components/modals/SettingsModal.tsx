import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';


const toggleStyles = {
  checkbox: {
    right: 0,
    zIndex: 1,
    borderColor: '#D1D5DB',
    transition: 'all 0.3s'
  },
  label: {
    width: '100%',
    transition: 'background-color 0.3s'
  }
};

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [energyUnit, setEnergyUnit] = useState('kWh');
  
  const handleSave = () => {
    
    console.log({
      notifications,
      emailAlerts,
      darkMode,
      fontSize,
      dateFormat,
      energyUnit
    });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'general' 
                ? 'text-accent-teal border-b-2 border-accent-teal' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'appearance' 
                ? 'text-accent-teal border-b-2 border-accent-teal' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'data' 
                ? 'text-accent-teal border-b-2 border-accent-teal' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('data')}
          >
            Data
          </button>
        </div>
     
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Push Notifications</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer toggle-checkbox"
                  style={{
                    ...toggleStyles.checkbox,
                    ...(notifications ? { borderColor: '#68D391', right: 0 } : {})
                  }}
                />
                <label 
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    notifications ? 'bg-accent-teal' : 'bg-gray-600'
                  }`}
                  style={toggleStyles.label}
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Email Alerts</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer toggle-checkbox"
                  style={{
                    ...toggleStyles.checkbox,
                    ...(emailAlerts ? { borderColor: '#68D391', right: 0 } : {})
                  }}
                />
                <label 
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    emailAlerts ? 'bg-accent-teal' : 'bg-gray-600'
                  }`}
                  style={toggleStyles.label}
                ></label>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm text-gray-300 mb-2">Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-accent-teal focus:border-accent-teal"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        )}
      
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Dark Mode</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer toggle-checkbox"
                  style={{
                    ...toggleStyles.checkbox,
                    ...(darkMode ? { borderColor: '#68D391', right: 0 } : {})
                  }}
                />
                <label 
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    darkMode ? 'bg-accent-teal' : 'bg-gray-600'
                  }`}
                  style={toggleStyles.label}
                ></label>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm text-gray-300 mb-2">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-accent-teal focus:border-accent-teal"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm text-gray-300 mb-2">Color Theme</label>
              <div className="grid grid-cols-5 gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer border-2 border-transparent hover:border-white"></div>
                <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer border-2 border-transparent hover:border-white"></div>
                <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer border-2 border-transparent hover:border-white"></div>
                <div className="w-8 h-8 rounded-full bg-teal-500 cursor-pointer border-2 border-transparent hover:border-white"></div>
                <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer border-2 border-transparent hover:border-white"></div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="mt-4">
              <label className="block text-sm text-gray-300 mb-2">Energy Unit</label>
              <select
                value={energyUnit}
                onChange={(e) => setEnergyUnit(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-accent-teal focus:border-accent-teal"
              >
                <option value="kWh">Kilowatt-hour (kWh)</option>
                <option value="J">Joule (J)</option>
                <option value="BTU">British Thermal Unit (BTU)</option>
              </select>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm text-gray-300 mb-2">Currency</label>
              <select
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-accent-teal focus:border-accent-teal"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm text-gray-300 mb-2">Data Refresh Rate</label>
              <select
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-accent-teal focus:border-accent-teal"
              >
                <option value="realtime">Real-time</option>
                <option value="1min">Every 1 minute</option>
                <option value="5min">Every 5 minutes</option>
                <option value="15min">Every 15 minutes</option>
                <option value="hour">Hourly</option>
              </select>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-8 space-x-3">
          <button 
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-accent-teal text-white rounded-md hover:bg-opacity-90"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
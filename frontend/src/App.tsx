import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { EnergyProvider } from './context/EnergyContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

const App = (): JSX.Element => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <EnergyProvider>
          <div className="flex h-screen bg-gray-900">
            <Sidebar isCollapsed={isSidebarCollapsed} />
          
            <div className="flex-1 flex flex-col">
              <Navbar toggleSidebar={toggleSidebar} />
              <div className="flex-1 overflow-auto">
                <AppRoutes />
              </div>
            </div>
          </div>
        </EnergyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
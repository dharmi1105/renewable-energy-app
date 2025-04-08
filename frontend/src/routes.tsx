import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cost from './pages/Cost';
import Appliances from './pages/Appliances';
import RoomUsage from './pages/RoomUsage';
import Emissions from './pages/Emissions';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { authState } = useAuth();
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      
      <Route path="/cost" element={
        <PrivateRoute>
          <Cost />
        </PrivateRoute>
      } />
      
      <Route path="/appliances" element={
        <PrivateRoute>
          <Appliances />
        </PrivateRoute>
      } />
      
      <Route path="/usage-by-rooms" element={
        <PrivateRoute>
          <RoomUsage />
        </PrivateRoute>
      } />
      
      <Route path="/emissions" element={
        <PrivateRoute>
          <Emissions />
        </PrivateRoute>
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
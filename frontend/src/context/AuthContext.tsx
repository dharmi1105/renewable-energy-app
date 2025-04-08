import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';
import * as authService from '../services/auth';
import api from '../services/api';


const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};


interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authState: initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        
        const demoCredentials = {
          username: 'demo',
          password: 'password' 
        };
        
        
        try {
          authService.setupTokenRefresh(demoCredentials);
        } catch (refreshError) {
          console.error('Token refresh setup failed:', refreshError);
        }
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        console.log('User restored from localStorage:', user);
      } catch (error) {
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.error('Error restoring auth state:', error);
      }
    }

    
    return () => {
      try {
        authService.clearTokenRefreshTimers();
      } catch (cleanupError) {
        console.error('Error during auth cleanup:', cleanupError);
      }
    };
  }, []);

  
  const login = async (credentials: LoginCredentials) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    try {
      console.log('Attempting login with:', credentials);
      const { token, user } = await authService.login(credentials);
      
      console.log('Login successful, token:', token);
      console.log('User:', user);
      
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Login error in context:', error);
      
      setAuthState({
        ...authState,
        isLoading: false,
        error: error.message || 'Invalid credentials',
      });
      
      throw error;
    }
  };

  
  const register = async (credentials: RegisterCredentials) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    try {
      console.log('Attempting registration with:', credentials);
      await authService.register(credentials);
      
      setAuthState({
        ...authState,
        isLoading: false,
        error: null,
      });
      
      console.log('Registration successful');
    } catch (error: any) {
      console.error('Registration error in context:', error);
      
      setAuthState({
        ...authState,
        isLoading: false,
        error: error.message || 'Registration failed',
      });
      
      throw error;
    }
  };

  
  const logout = () => {
    
    authService.logout();
    
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    
    console.log('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);

export default AuthContext;
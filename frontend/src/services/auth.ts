import axios from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

let tokenRefreshTimer: NodeJS.Timeout | null = null;


const API_URL = 'http://localhost:8000';

export const setupTokenRefresh = (credentials: LoginCredentials) => {
  clearTokenRefreshTimers();
  
  tokenRefreshTimer = setTimeout(async () => {
    try {
      await login(credentials);
      console.log('Token refreshed silently');
    } catch (error) {
      console.error('Silent token refresh failed', error);
    }
  }, 15 * 60 * 1000);
};

export const clearTokenRefreshTimers = () => {
  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
    tokenRefreshTimer = null;
  }
};


export const login = async (credentials: LoginCredentials): Promise<{ token: string, user: User }> => {
  try {
    console.log('Attempting login with credentials:', credentials);
    
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await axios.post(`${API_URL}/token`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Login response:', response.data);
    
    const { access_token } = response.data;
    
    if (!access_token) {
      throw new Error('No token received from server');
    }
    
    localStorage.setItem('token', access_token);
    
    const user = {
      id: '1',
      username: credentials.username,
      email: `${credentials.username}@example.com`,
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    
    return {
      token: access_token,
      user,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials or server unreachable');
  }
};

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  try {
    console.log('Attempting to register with credentials:', credentials);
    
    
    const response = await axios.post(`${API_URL}/register`, {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    });
    
    console.log('Registration response:', response.data);
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Registration failed or server unreachable');
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  clearTokenRefreshTimers();

  if (axios.defaults && axios.defaults.headers) {
    delete axios.defaults.headers.common['Authorization'];
  }

  window.location.href = '/login';
  
  console.log('User logged out');
};
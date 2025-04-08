import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const MAX_RETRIES = 3;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: number;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }
   
    const retryCount = Math.max(0, originalRequest._retry ?? 0);
    
    console.error('API Request Error:', {
      url: originalRequest.url,
      method: originalRequest.method,
      error: error.message,
      response: error.response,
      request: error.request,
      retryCount
    });
    
    if (error.message === 'Network Error' || 
        (error.response && error.response.status === 0)) {
      console.warn('Network or CORS Error Detected. Falling back to mock data.');
      
      return Promise.resolve({ 
        data: [], 
        status: 200, 
        statusText: 'Mock Data Returned', 
        headers: {}, 
        config: originalRequest 
      });
    }
    
    if (error.response?.status && 
        error.response.status >= 500 && 
        retryCount < MAX_RETRIES) {
      
      originalRequest._retry = retryCount + 1;
      
      console.warn(`Server error, retry attempt ${originalRequest._retry}...`);
    
      await new Promise(resolve => 
        setTimeout(resolve, 1000 * Math.pow(2, retryCount + 1))
      );
      
      return api(originalRequest);
    }
  
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      const responseData = error.response.data as any;
      errorMessage = responseData?.detail || 
                     responseData?.message || 
                     errorMessage;
    }
    
    console.error('Final API Error:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
 
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
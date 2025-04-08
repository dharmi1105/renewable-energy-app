import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { RegisterCredentials } from '../types/auth';

const Register: React.FC = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    form: ''
  });
  
  const { authState, register } = useAuth();
  const navigate = useNavigate();
  
  
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    }
    
    
    const clearError = () => {
      setFormErrors({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        form: ''
      });
    };

    clearError();
  }, [authState.isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    
    if (formErrors.form) {
      setFormErrors(prev => ({ ...prev, form: '' }));
    }
  };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: Record<string, string> = {};
    
    
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (credentials.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      valid = false;
    }
    
    
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(credentials.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, and numbers';
      valid = false;
    }
    
    
    if (!credentials.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    setFormErrors(prev => ({ ...prev, ...newErrors }));
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        
        const { confirmPassword, ...registerData } = credentials;
        
        await register(registerData);
        
        
        navigate('/login');
      } catch (error: any) {
        setFormErrors(prev => ({
          ...prev,
          form: error.message || 'Registration failed. Please try again.'
        }));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-dark p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-white">RENEWABLE ENERGY</span>
          <span className="text-green-500 text-sm ml-1">DASHBOARD</span>
        </h1>
        <h2 className="text-2xl font-bold text-white">
          Create your account
        </h2>
      </div>

      <div className="bg-secondary-dark rounded-lg shadow-lg p-8 w-full max-w-md">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={credentials.username}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-teal focus:border-accent-teal bg-tertiary-dark text-white text-sm
                ${formErrors.username ? 'border-red-500' : 'border-gray-600'}`}
                disabled={authState.isLoading}
              />
              {formErrors.username && (
                <p className="mt-2 text-sm text-red-500">{formErrors.username}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-teal focus:border-accent-teal bg-tertiary-dark text-white text-sm
                ${formErrors.email ? 'border-red-500' : 'border-gray-600'}`}
                disabled={authState.isLoading}
              />
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={credentials.password}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-teal focus:border-accent-teal bg-tertiary-dark text-white text-sm
                ${formErrors.password ? 'border-red-500' : 'border-gray-600'}`}
                disabled={authState.isLoading}
              />
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={credentials.confirmPassword}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-teal focus:border-accent-teal bg-tertiary-dark text-white text-sm
                ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`}
                disabled={authState.isLoading}
              />
              {formErrors.confirmPassword && (
                <p className="mt-2 text-sm text-red-500">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-teal hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-teal disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={authState.isLoading}
            >
              {authState.isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Creating account...</span>
                </div>
              ) : 'Register'}
            </button>
          </div>

          {(authState.error || formErrors.form) && (
            <div className="p-2 bg-red-500 bg-opacity-20 border border-red-500 rounded text-center">
              <p className="text-sm text-red-500">{authState.error || formErrors.form}</p>
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-teal hover:text-accent-teal hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
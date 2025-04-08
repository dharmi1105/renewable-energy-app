import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  });
  
  const { authState, login } = useAuth();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [authState.isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
 
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    if (!credentials.username) {
      newErrors.username = 'Username is required';
      valid = false;
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await login(credentials);
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
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
          Sign in to your account
        </h2>
      </div>

      <div className="bg-secondary-dark rounded-lg shadow-lg p-8 w-full max-w-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-teal focus:border-accent-teal bg-tertiary-dark text-white text-sm"
              />
              {formErrors.username && (
                <p className="mt-2 text-sm text-red-500">{formErrors.username}</p>
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
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-teal focus:border-accent-teal bg-tertiary-dark text-white text-sm"
              />
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={authState.isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-teal hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-teal"
            >
              {authState.isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {authState.error && (
            <div className="p-2 bg-red-500 bg-opacity-20 border border-red-500 rounded text-center">
              <p className="text-sm text-red-500">{authState.error}</p>
            </div>
          )}
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-secondary-dark text-gray-400">
                Or use demo credentials
              </span>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-center text-gray-400">
            <p>Username: demo</p>
            <p>Password: password</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-teal hover:text-accent-teal hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
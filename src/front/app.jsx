import React, { useState, useEffect, createContext, useContext } from 'react';
// Import your separated components
import Login from './components/Login';
import Signup from './components/Signup';
import Private from './components/Private';

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



const getApiBaseUrl = () => {
 
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
 
  if (window.location.hostname.includes('app.github.dev')) {
    const hostname = window.location.hostname;
   
    const backendHostname = hostname.replace('-3000.', '-5001.');
    return `https://${backendHostname}`;
  }
  
 
  return 'http://localhost:5001';
};

const API_BASE_URL = getApiBaseUrl();


console.log('API_BASE_URL:', API_BASE_URL);


export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  } catch (error) {
    // Enhanced error logging for debugging
    console.error('API Request failed:', {
      url,
      error: error.message,
      config
    });
    throw error;
  }
};

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Private />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {currentView === 'login' && (
          <Login onSwitchToSignup={() => setCurrentView('signup')} />
        )}
        {currentView === 'signup' && (
          <Signup onSwitchToLogin={() => setCurrentView('login')} />
        )}
      </div>
    </div>
  );
};


export default function AuthApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
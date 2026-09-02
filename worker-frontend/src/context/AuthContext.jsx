import React, { createContext, useContext, useState, useEffect } from 'react';
import { authGateway, workerGateway } from '../services/integrations';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize session
  useEffect(() => {
    async function initSession() {
      try {
        const storedAuth = localStorage.getItem('skillbridge_worker_auth');
        if (storedAuth === 'true') {
          const profile = await authGateway.getCurrentWorker();
          setWorker(profile);
          setIsAuthenticated(true);
        } else {
          // Default authenticated demo profile for convenience
          const profile = await authGateway.getCurrentWorker();
          setWorker(profile);
          setIsAuthenticated(true);
          localStorage.setItem('skillbridge_worker_auth', 'true');
        }
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true);
    try {
      const res = await authGateway.login(email, password, rememberMe);
      setWorker(res.worker);
      setIsAuthenticated(true);
      localStorage.setItem('skillbridge_worker_auth', 'true');
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registrationData) => {
    setIsLoading(true);
    try {
      const res = await authGateway.registerWorker(registrationData);
      setWorker(res.worker);
      setIsAuthenticated(true);
      localStorage.setItem('skillbridge_worker_auth', 'true');
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authGateway.logout();
      setWorker(null);
      setIsAuthenticated(false);
      localStorage.removeItem('skillbridge_worker_auth');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = async (updates) => {
    const res = await workerGateway.updateProfile(updates);
    if (res.success) {
      setWorker(res.worker);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        worker,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

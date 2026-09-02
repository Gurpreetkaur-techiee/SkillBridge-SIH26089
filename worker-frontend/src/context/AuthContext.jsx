import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  authGateway,
  workerGateway,
} from '../services/integrations';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [worker, setWorker] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);


  // =====================================
  // INITIALIZE FIREBASE SESSION
  // =====================================

  useEffect(() => {

    const unsubscribe =
      authGateway.onAuthStateChanged(
        async (firebaseUser) => {

          try {

            if (firebaseUser) {

              const profile =
                await authGateway.getCurrentWorker();

              if (profile) {

                setWorker(profile);

                setIsAuthenticated(true);

              } else {

                setWorker(null);

                setIsAuthenticated(false);

              }

            } else {

              setWorker(null);

              setIsAuthenticated(false);

            }

          } catch (error) {

            console.error(
              'Session initialization error:',
              error
            );

            setWorker(null);

            setIsAuthenticated(false);

          } finally {

            setIsLoading(false);

          }

        }
      );


    return () => {

      unsubscribe();

    };

  }, []);


  // =====================================
  // LOGIN
  // =====================================

  const login = async (
    email,
    password,
    rememberMe = false
  ) => {

    setIsLoading(true);

    try {

      const result =
        await authGateway.login(
          email,
          password,
          rememberMe
        );

      setWorker(result.worker);

      setIsAuthenticated(true);

      return result;

    } finally {

      setIsLoading(false);

    }

  };


  // =====================================
  // REGISTER
  // =====================================

  const register = async (
    registrationData
  ) => {

    setIsLoading(true);

    try {

      const result =
        await authGateway.registerWorker(
          registrationData
        );

      setWorker(result.worker);

      setIsAuthenticated(true);

      return result;

    } finally {

      setIsLoading(false);

    }

  };


  // =====================================
  // LOGOUT
  // =====================================

  const logout = async () => {

    setIsLoading(true);

    try {

      await authGateway.logout();

      setWorker(null);

      setIsAuthenticated(false);

    } catch (error) {

      console.error(
        'Logout error:',
        error
      );

      throw error;

    } finally {

      setIsLoading(false);

    }

  };


  // =====================================
  // UPDATE PROFILE
  // =====================================

  const updateProfile =
    async (updates) => {

      const result =
        await workerGateway.updateProfile(
          updates
        );

      if (result.success) {

        setWorker(
          result.worker
        );

      }

      return result;

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

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      'useAuth must be used within an AuthProvider'
    );

  }

  return context;

}
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  // Open & close auth modal helpers
  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  // Firebase auth state listener
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'Customer Pro',
            photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
            emailVerified: user.emailVerified,
            isAnonymous: user.isAnonymous
          });
        } else {
          // Check if there is a local demo user session
          const savedDemoUser = localStorage.getItem('skillbridge_demo_user');
          if (savedDemoUser) {
            setCurrentUser(JSON.parse(savedDemoUser));
          } else {
            setCurrentUser(null);
          }
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.warn("Firebase Auth listener initialization notice:", err.message);
      // Fallback: check demo user in localStorage
      const savedDemoUser = localStorage.getItem('skillbridge_demo_user');
      if (savedDemoUser) {
        setCurrentUser(JSON.parse(savedDemoUser));
      }
      setLoading(false);
    }
  }, []);

  // Sign up with Email and Password
  const signup = async (email, password, displayName = '') => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
        });
      }
      setCurrentUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || email.split('@')[0],
        photoURL: userCredential.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
      });
      localStorage.removeItem('skillbridge_demo_user');
      closeAuthModal();
      return userCredential.user;
    } catch (error) {
      // If Firebase project credentials are not configured or request fails, support graceful fallback for local development
      if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/invalid-api-key' || error.message.includes('API key')) {
        const mockUser = {
          uid: `user_${Date.now()}`,
          email,
          displayName: displayName || email.split('@')[0],
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName || email)}`
        };
        setCurrentUser(mockUser);
        localStorage.setItem('skillbridge_demo_user', JSON.stringify(mockUser));
        closeAuthModal();
        return mockUser;
      }
      setAuthError(getFriendlyErrorMessage(error.code || error.message));
      throw error;
    }
  };

  // Log in with Email and Password
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || email.split('@')[0],
        photoURL: userCredential.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
      });
      localStorage.removeItem('skillbridge_demo_user');
      closeAuthModal();
      return userCredential.user;
    } catch (error) {
      if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/invalid-api-key' || error.message.includes('API key')) {
        const mockUser = {
          uid: `user_${Date.now()}`,
          email,
          displayName: email.split('@')[0],
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
        };
        setCurrentUser(mockUser);
        localStorage.setItem('skillbridge_demo_user', JSON.stringify(mockUser));
        closeAuthModal();
        return mockUser;
      }
      setAuthError(getFriendlyErrorMessage(error.code || error.message));
      throw error;
    }
  };

  // Google Sign In
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || result.user.email.split('@')[0],
        photoURL: result.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
      });
      localStorage.removeItem('skillbridge_demo_user');
      closeAuthModal();
      return result.user;
    } catch (error) {
      if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/invalid-api-key' || error.message.includes('API key')) {
        const mockUser = {
          uid: `google_user_${Date.now()}`,
          email: "alex.customer@gmail.com",
          displayName: "Alex Morgan",
          photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250"
        };
        setCurrentUser(mockUser);
        localStorage.setItem('skillbridge_demo_user', JSON.stringify(mockUser));
        closeAuthModal();
        return mockUser;
      }
      setAuthError(getFriendlyErrorMessage(error.code || error.message));
      throw error;
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("SignOut notice:", e.message);
    }
    localStorage.removeItem('skillbridge_demo_user');
    setCurrentUser(null);
  };

  // Password Reset
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setAuthError(getFriendlyErrorMessage(error.code || error.message));
      throw error;
    }
  };

  // Demo Login Helper for instant testing
  const loginAsDemoCustomer = () => {
    const demoUser = {
      uid: "demo-customer-101",
      email: "alex.morgan@example.com",
      displayName: "Alex Morgan",
      photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250"
    };
    setCurrentUser(demoUser);
    localStorage.setItem('skillbridge_demo_user', JSON.stringify(demoUser));
    closeAuthModal();
  };

  const getFriendlyErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check and try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in popup was closed before completing.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection.';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        setAuthError,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signup,
        login,
        logout,
        loginWithGoogle,
        resetPassword,
        loginAsDemoCustomer
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

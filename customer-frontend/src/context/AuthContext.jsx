import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  // Create/update customer document in Firestore
  const createUserDocument = async (user, displayName = '') => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);

    const name =
      displayName.trim() ||
      user.displayName ||
      user.email?.split('@')[0] ||
      'Customer';

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name,
        email: user.email || '',
        role: 'customer',
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        userRef,
        {
          name,
          email: user.email || '',
          photoURL: user.photoURL || null,
          emailVerified: user.emailVerified,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  };

  // Listen for Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await createUserDocument(user);

          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName:
              user.displayName ||
              user.email?.split('@')[0] ||
              'Customer',
            photoURL: user.photoURL || null,
            emailVerified: user.emailVerified,
            isAnonymous: user.isAnonymous,
          });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error syncing user with Firestore:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Create Firebase account + Firestore user document
  const signup = async (email, password, displayName = '') => {
    setAuthError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (displayName.trim()) {
        await updateProfile(user, {
          displayName: displayName.trim(),
        });
      }

      await createUserDocument(user, displayName);

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName:
          displayName.trim() ||
          user.email?.split('@')[0] ||
          'Customer',
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
      });

      closeAuthModal();

      return user;
    } catch (error) {
      console.error('Signup error:', error);

      const friendlyMessage = getFriendlyErrorMessage(error.code);
      setAuthError(friendlyMessage);

      throw error;
    }
  };

  // Login with Firebase email/password
  const login = async (email, password) => {
    setAuthError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await createUserDocument(user);

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName:
          user.displayName ||
          user.email?.split('@')[0] ||
          'Customer',
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
      });

      closeAuthModal();

      return user;
    } catch (error) {
      console.error('Login error:', error);

      const friendlyMessage = getFriendlyErrorMessage(error.code);
      setAuthError(friendlyMessage);

      throw error;
    }
  };

  // Login with Google + Firestore user document
  const loginWithGoogle = async () => {
    setAuthError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      await createUserDocument(user);

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName:
          user.displayName ||
          user.email?.split('@')[0] ||
          'Customer',
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
      });

      closeAuthModal();

      return user;
    } catch (error) {
      console.error('Google login error:', error);

      const friendlyMessage = getFriendlyErrorMessage(error.code);
      setAuthError(friendlyMessage);

      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setAuthError(null);

    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      setAuthError(getFriendlyErrorMessage(error.code));
      throw error;
    }
  };

  // Password reset
  const resetPassword = async (email) => {
    setAuthError(null);

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const friendlyMessage = getFriendlyErrorMessage(error.code);

      setAuthError(friendlyMessage);

      throw error;
    }
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

      case 'auth/operation-not-allowed':
        return 'Email/password authentication is not enabled in Firebase.';

      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled.';

      case 'auth/popup-blocked':
        return 'The Google sign-in popup was blocked by the browser.';

      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection.';

      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.';

      case 'auth/api-key-not-valid':
      case 'auth/invalid-api-key':
        return 'Firebase configuration is invalid. Please check the environment settings.';

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
/**
 * SkillBridge Worker Frontend Integration Layer
 * Firebase version
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import { auth, db } from '../firebase';

// =================================================
// AUTH GATEWAY
// =================================================

export const authGateway = {
  // Worker Login
  async login(email, password, rememberMe = false) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Get worker profile from Firestore
      const workerRef = doc(db, 'workers', user.uid);
      const workerSnap = await getDoc(workerRef);

      if (!workerSnap.exists()) {
        throw new Error(
          'Worker profile not found. Please register first.'
        );
      }

      return {
        success: true,
        worker: {
          id: user.uid,
          ...workerSnap.data(),
        },
      };
    } catch (error) {
      console.error('Login error:', error);

      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password.');
      }

      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email.');
      }

      if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.');
      }

      throw new Error(error.message || 'Login failed.');
    }
  },

  // Worker Registration
  async registerWorker(registrationData) {
    const {
      email,
      password,
      fullName,
      confirmPassword,
      ...workerData
    } = registrationData;

    if (!email || !password || !fullName) {
      throw new Error(
        'Please fill in all required registration fields.'
      );
    }

    try {
      // 1. Create Firebase Authentication account
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // 2. Prepare worker profile
      const newWorker = {
        id: user.uid,
        fullName,
        email,
        ...workerData,

        rating: 0,
        reviewsCount: 0,
        completedJobsCount: 0,

        isAvailable: true,
        verified: false,

        avatarUrl: null,

        serviceRadiusKm: 15,

        languages: [
          'English',
          'Hindi',
        ],

        memberSince:
          new Date().toISOString().split('T')[0],

        createdAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      };

      // 3. Save worker profile in Firestore
      await setDoc(
        doc(db, 'workers', user.uid),
        newWorker
      );

      return {
        success: true,
        worker: newWorker,
      };

    } catch (error) {
      console.error(
        'Worker registration error:',
        error
      );

      if (error.code === 'auth/email-already-in-use') {
        throw new Error(
          'An account already exists with this email.'
        );
      }

      if (error.code === 'auth/weak-password') {
        throw new Error(
          'Password must be at least 6 characters.'
        );
      }

      throw new Error(
        error.message ||
        'Registration failed. Please try again.'
      );
    }
  },

  // Get Current Logged-In Worker
  async getCurrentWorker() {
    const user = auth.currentUser;

    if (!user) {
      return null;
    }

    const workerRef = doc(
      db,
      'workers',
      user.uid
    );

    const workerSnap =
      await getDoc(workerRef);

    if (!workerSnap.exists()) {
      return null;
    }

    return {
      id: user.uid,
      ...workerSnap.data(),
    };
  },

  // Logout
  async logout() {
    await signOut(auth);

    return {
      success: true,
    };
  },

  // Listen for Firebase Auth session changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(
      auth,
      callback
    );
  },
};


// =================================================
// WORKER PROFILE GATEWAY
// =================================================

export const workerGateway = {

  async getProfile() {
    const user = auth.currentUser;

    if (!user) {
      throw new Error(
        'No worker is currently logged in.'
      );
    }

    const workerRef = doc(
      db,
      'workers',
      user.uid
    );

    const workerSnap =
      await getDoc(workerRef);

    if (!workerSnap.exists()) {
      throw new Error(
        'Worker profile not found.'
      );
    }

    return {
      id: user.uid,
      ...workerSnap.data(),
    };
  },


  async updateProfile(updates) {
    const user = auth.currentUser;

    if (!user) {
      throw new Error(
        'No worker is currently logged in.'
      );
    }

    const workerRef = doc(
      db,
      'workers',
      user.uid
    );

    const updatedData = {
      ...updates,
      updatedAt:
        new Date().toISOString(),
    };

    await updateDoc(
      workerRef,
      updatedData
    );

    const updatedWorker =
      await this.getProfile();

    return {
      success: true,
      worker: updatedWorker,
    };
  },


  async setAvailability(isAvailable) {
    const user = auth.currentUser;

    if (!user) {
      throw new Error(
        'No worker is currently logged in.'
      );
    }

    const workerRef = doc(
      db,
      'workers',
      user.uid
    );

    await updateDoc(
      workerRef,
      {
        isAvailable,
        updatedAt:
          new Date().toISOString(),
      }
    );

    return {
      success: true,
      isAvailable,
    };
  },


  async getSettings() {
    const worker =
      await this.getProfile();

    return {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },

      serviceRadiusKm:
        worker.serviceRadiusKm || 15,

      autoAcceptNearby: false,
    };
  },


  async updateSettings(settings) {
    return {
      success: true,
      settings,
    };
  },
};


// =================================================
// BOOKINGS GATEWAY
// TEMPORARY - WILL CONNECT TO FIRESTORE NEXT
// =================================================

export const bookingsGateway = {

  async getAvailableBookings() {
    return [];
  },

  async getBooking() {
    return null;
  },

  async addBookingRequest() {
    throw new Error(
      'Booking integration is not connected yet.'
    );
  },

  async acceptBooking() {
    throw new Error(
      'Booking integration is not connected yet.'
    );
  },

  async rejectBooking() {
    throw new Error(
      'Booking integration is not connected yet.'
    );
  },

  async getMyBookings() {
    return [];
  },

  async updateBookingStatus() {
    throw new Error(
      'Booking integration is not connected yet.'
    );
  },
};


// =================================================
// NOTIFICATIONS
// TEMPORARY
// =================================================

export const notificationsGateway = {

  async getNotifications() {
    return [];
  },

  async addNotification() {
    return {
      success: true,
    };
  },

  async markAsRead() {
    return {
      success: true,
    };
  },

  async markAllAsRead() {
    return {
      success: true,
    };
  },
};


// =================================================
// EARNINGS
// TEMPORARY
// =================================================

export const earningsGateway = {

  async getEarningsSummary() {
    return {
      totalEarnings: 0,
      thisMonth: 0,
      pendingPayouts: 0,
      completedJobsCount: 0,
      transactions: [],
      monthlyBreakdown: [],
    };
  },

  async getTransactions() {
    return [];
  },
};
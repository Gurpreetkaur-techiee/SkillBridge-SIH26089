// src/services/integrations.js

import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';

import { db } from '../firebase';

// Temporary function for features not connected yet
const unavailable = (name) =>
  Promise.reject(
    new Error(`${name} is waiting for Firebase integration.`)
  );


// =========================
// AUTH
// =========================

export const authGateway = {
  login: (email, password, rememberMe) =>
    unavailable('Login'),

  signup: (userData) =>
    unavailable('Signup'),

  resetPassword: (email) =>
    unavailable('Password reset'),

  restoreSession: () =>
    Promise.resolve(null)
};


// =========================
// CUSTOMER
// =========================

export const customerGateway = {

  // Workers
  getWorkers: (filters) =>
    unavailable('Worker search'),

  getWorker: (id) =>
    unavailable('Worker profile'),


  // CREATE BOOKING
  createBooking: async (data) => {
    try {
      const bookingData = {
        ...data,
        status: 'requested',
        createdAt: new Date().toISOString()
      };

      const bookingRef = await addDoc(
        collection(db, 'bookings'),
        bookingData
      );

      return {
        id: bookingRef.id,
        ...bookingData
      };

    } catch (error) {
      console.error('Booking creation error:', error);
      throw new Error('Unable to create booking. Please try again.');
    }
  },


  // GET ALL BOOKINGS
  getBookings: async () => {
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(bookingsQuery);

      return snapshot.docs.map((booking) => ({
        id: booking.id,
        ...booking.data()
      }));

    } catch (error) {
      console.error('Get bookings error:', error);

      // Fallback if Firestore ordering causes an issue
      const snapshot = await getDocs(
        collection(db, 'bookings')
      );

      return snapshot.docs.map((booking) => ({
        id: booking.id,
        ...booking.data()
      }));
    }
  },


  // GET SINGLE BOOKING
  getBooking: async (id) => {
    try {
      const bookingRef = doc(db, 'bookings', id);

      const snapshot = await getDoc(bookingRef);

      if (!snapshot.exists()) {
        throw new Error('Booking not found.');
      }

      return {
        id: snapshot.id,
        ...snapshot.data()
      };

    } catch (error) {
      console.error('Get booking error:', error);
      throw error;
    }
  },


  // Notifications
  getNotifications: () =>
    unavailable('Notifications'),


  // Payment
  startPayment: (booking) =>
    unavailable('Razorpay payment'),


  // Review
  submitReview: (data) =>
    unavailable('Review submission'),


  // Location
  getCurrentLocation: () =>
    unavailable('Location')
};
/**
 * SkillBridge Worker Frontend Integration Layer
 * Firebase Version
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

import { auth, db } from '../firebase';


// =================================================
// AUTH GATEWAY
// =================================================

export const authGateway = {

  /**
   * Worker Login
   */
  async login(email, password, rememberMe = false) {
    if (!email || !password) {
      throw new Error(
        'Email and password are required.'
      );
    }

    try {
      await setPersistence(
        auth,
        rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence
      );

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      const workerRef = doc(
        db,
        'workers',
        user.uid
      );

      const workerSnap =
        await getDoc(workerRef);

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
      console.error(
        'Login error:',
        error
      );

      switch (error.code) {

        case 'auth/invalid-credential':
          throw new Error(
            'Invalid email or password.'
          );

        case 'auth/user-not-found':
          throw new Error(
            'No account found with this email.'
          );

        case 'auth/wrong-password':
          throw new Error(
            'Incorrect password.'
          );

        case 'auth/invalid-email':
          throw new Error(
            'Please enter a valid email address.'
          );

        default:
          throw new Error(
            error.message ||
            'Login failed.'
          );
      }
    }
  },


  /**
   * Worker Registration
   */
  async registerWorker(registrationData) {

    const {
      email,
      password,
      fullName,
      confirmPassword,
      ...workerData
    } = registrationData;

    if (
      !email ||
      !password ||
      !fullName
    ) {
      throw new Error(
        'Please fill in all required registration fields.'
      );
    }

    if (password.length < 6) {
      throw new Error(
        'Password must be at least 6 characters.'
      );
    }

    if (
      confirmPassword &&
      password !== confirmPassword
    ) {
      throw new Error(
        'Passwords do not match.'
      );
    }

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user =
        userCredential.user;

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

        serviceRadiusKm:
          workerData.serviceRadiusKm || 15,

        languages:
          workerData.languages || [
            'English',
            'Hindi',
          ],

        memberSince:
          new Date()
            .toISOString()
            .split('T')[0],

        createdAt:
          new Date()
            .toISOString(),

        updatedAt:
          new Date()
            .toISOString(),
      };


      await setDoc(
        doc(
          db,
          'workers',
          user.uid
        ),
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

      switch (error.code) {

        case 'auth/email-already-in-use':
          throw new Error(
            'An account already exists with this email.'
          );

        case 'auth/weak-password':
          throw new Error(
            'Password must be at least 6 characters.'
          );

        case 'auth/invalid-email':
          throw new Error(
            'Please enter a valid email address.'
          );

        default:
          throw new Error(
            error.message ||
            'Registration failed. Please try again.'
          );
      }
    }
  },


  /**
   * Get Current Worker
   */
  async getCurrentWorker() {

    const user =
      auth.currentUser;

    if (!user) {
      return null;
    }

    try {

      const workerRef =
        doc(
          db,
          'workers',
          user.uid
        );

      const workerSnap =
        await getDoc(
          workerRef
        );

      if (!workerSnap.exists()) {
        return null;
      }

      return {
        id: user.uid,
        ...workerSnap.data(),
      };

    } catch (error) {

      console.error(
        'Get current worker error:',
        error
      );

      return null;
    }
  },


  /**
   * Logout
   */
  async logout() {

    try {

      await signOut(auth);

      return {
        success: true,
      };

    } catch (error) {

      console.error(
        'Logout error:',
        error
      );

      throw new Error(
        error.message ||
        'Logout failed.'
      );
    }
  },


  /**
   * Auth State Listener
   */
  onAuthStateChanged(callback) {

    return onAuthStateChanged(
      auth,
      callback
    );
  },
};


// =================================================
// WORKER GATEWAY
// =================================================

export const workerGateway = {


  /**
   * Get Worker Profile
   */
  async getProfile() {

    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        'No worker is currently logged in.'
      );
    }

    const workerRef =
      doc(
        db,
        'workers',
        user.uid
      );

    const workerSnap =
      await getDoc(
        workerRef
      );

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


  /**
   * Update Worker Profile
   */
  async updateProfile(updates) {

    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        'No worker is currently logged in.'
      );
    }

    try {

      const workerRef =
        doc(
          db,
          'workers',
          user.uid
        );

      await updateDoc(
        workerRef,
        {
          ...updates,

          updatedAt:
            new Date()
              .toISOString(),
        }
      );

      const updatedWorker =
        await this.getProfile();

      return {
        success: true,
        worker:
          updatedWorker,
      };

    } catch (error) {

      console.error(
        'Update profile error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to update profile.'
      );
    }
  },


  /**
   * Worker Availability
   */
  async setAvailability(isAvailable) {

    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        'No worker is currently logged in.'
      );
    }

    const workerRef =
      doc(
        db,
        'workers',
        user.uid
      );

    await updateDoc(
      workerRef,
      {
        isAvailable,

        updatedAt:
          new Date()
            .toISOString(),
      }
    );

    return {
      success: true,
      isAvailable,
    };
  },


  /**
   * Worker Settings
   */
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


  /**
   * Update Settings
   */
  async updateSettings(settings) {

    return {
      success: true,
      settings,
    };
  },
};


// =================================================
// BOOKINGS GATEWAY
// FIRESTORE
// =================================================

export const bookingsGateway = {


  /**
   * Get all available bookings
   */
  async getAvailableBookings() {

    try {

      const bookingsRef =
        collection(
          db,
          'bookings'
        );

      const snapshot =
        await getDocs(
          bookingsRef
        );

      const bookings =
        snapshot.docs.map(
          (document) => {

            const data =
              document.data();

            return {
              id:
                document.id,

              ...data,

              createdAt:
                data.createdAt?.toDate
                  ? data.createdAt
                      .toDate()
                      .toISOString()
                  : data.createdAt,
            };
          }
        );


      return bookings.filter(
        (booking) =>
          !booking.workerId &&
          (
            !booking.status ||
            booking.status === 'open' ||
            booking.status === 'pending'
          )
      );

    } catch (error) {

      console.error(
        'Get available bookings error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to load available bookings.'
      );
    }
  },


  /**
   * Get Single Booking
   */
  async getBooking(bookingId) {

    if (!bookingId) {
      throw new Error(
        'Booking ID is required.'
      );
    }

    try {

      const bookingRef =
        doc(
          db,
          'bookings',
          bookingId
        );

      const bookingSnap =
        await getDoc(
          bookingRef
        );

      if (!bookingSnap.exists()) {
        return null;
      }

      const data =
        bookingSnap.data();

      return {
        id:
          bookingSnap.id,

        ...data,

        createdAt:
          data.createdAt?.toDate
            ? data.createdAt
                .toDate()
                .toISOString()
            : data.createdAt,

        updatedAt:
          data.updatedAt?.toDate
            ? data.updatedAt
                .toDate()
                .toISOString()
            : data.updatedAt,
      };

    } catch (error) {

      console.error(
        'Get booking error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to load booking.'
      );
    }
  },


  /**
   * Add Booking Request
   * Mainly for Customer Side
   */
  async addBookingRequest(bookingData) {

    try {

      const bookingRef =
        doc(
          collection(
            db,
            'bookings'
          )
        );

      const booking =
        {
          ...bookingData,

          status:
            'open',

          workerId:
            null,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        };


      await setDoc(
        bookingRef,
        booking
      );


      return {
        success: true,

        booking: {
          id:
            bookingRef.id,

          ...booking,
        },
      };

    } catch (error) {

      console.error(
        'Add booking error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to create booking.'
      );
    }
  },


  /**
   * Worker Accept Booking
   */
  async acceptBooking(bookingId) {

    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        'Please login first.'
      );
    }

    try {

      const bookingRef =
        doc(
          db,
          'bookings',
          bookingId
        );

      const bookingSnap =
        await getDoc(
          bookingRef
        );

      if (!bookingSnap.exists()) {
        throw new Error(
          'Booking not found.'
        );
      }


      const bookingData =
        bookingSnap.data();


      if (
        bookingData.workerId &&
        bookingData.workerId !== user.uid
      ) {
        throw new Error(
          'This booking has already been accepted by another worker.'
        );
      }


      await updateDoc(
        bookingRef,
        {
          workerId:
            user.uid,

          status:
            'accepted',

          acceptedAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );


      const updatedBooking =
        await this.getBooking(
          bookingId
        );


      return {
        success: true,

        booking:
          updatedBooking,
      };

    } catch (error) {

      console.error(
        'Accept booking error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to accept booking.'
      );
    }
  },


  /**
   * Reject Booking
   */
  async rejectBooking(bookingId) {

    try {

      const bookingRef =
        doc(
          db,
          'bookings',
          bookingId
        );

      await updateDoc(
        bookingRef,
        {
          status:
            'rejected',

          rejectedAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );


      return {
        success: true,
      };

    } catch (error) {

      console.error(
        'Reject booking error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to reject booking.'
      );
    }
  },


  /**
   * Get Logged-in Worker's Bookings
   */
  async getMyBookings() {

    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        'Please login first.'
      );
    }

    try {

      const bookingsRef =
        collection(
          db,
          'bookings'
        );


      const q =
        query(
          bookingsRef,
          where(
            'workerId',
            '==',
            user.uid
          )
        );


      const snapshot =
        await getDocs(
          q
        );


      return snapshot.docs.map(
        (document) => {

          const data =
            document.data();

          return {
            id:
              document.id,

            ...data,

            createdAt:
              data.createdAt?.toDate
                ? data.createdAt
                    .toDate()
                    .toISOString()
                : data.createdAt,

            updatedAt:
              data.updatedAt?.toDate
                ? data.updatedAt
                    .toDate()
                    .toISOString()
                : data.updatedAt,
          };
        }
      );

    } catch (error) {

      console.error(
        'Get my bookings error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to load your bookings.'
      );
    }
  },


  /**
   * Update Booking Status
   */
  async updateBookingStatus(
    bookingId,
    newStatus
  ) {

    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        'Please login first.'
      );
    }

    try {

      const bookingRef =
        doc(
          db,
          'bookings',
          bookingId
        );


      const bookingSnap =
        await getDoc(
          bookingRef
        );


      if (!bookingSnap.exists()) {
        throw new Error(
          'Booking not found.'
        );
      }


      const bookingData =
        bookingSnap.data();


      if (
        bookingData.workerId !==
        user.uid
      ) {
        throw new Error(
          'You are not assigned to this booking.'
        );
      }


      const updateData =
        {
          status:
            newStatus,

          updatedAt:
            serverTimestamp(),
        };


      if (
        newStatus ===
        'in_progress'
      ) {
        updateData.startedAt =
          serverTimestamp();
      }


      if (
        newStatus ===
        'completed'
      ) {

        updateData.completedAt =
          serverTimestamp();

        const workerRef =
          doc(
            db,
            'workers',
            user.uid
          );


        const workerSnap =
          await getDoc(
            workerRef
          );


        if (
          workerSnap.exists()
        ) {

          const workerData =
            workerSnap.data();

          const currentCompleted =
            Number(
              workerData.completedJobsCount ||
              0
            );


          await updateDoc(
            workerRef,
            {
              completedJobsCount:
                currentCompleted + 1,

              updatedAt:
                serverTimestamp(),
            }
          );
        }
      }


      await updateDoc(
        bookingRef,
        updateData
      );


      const updatedBooking =
        await this.getBooking(
          bookingId
        );


      return {
        success: true,

        booking:
          updatedBooking,
      };

    } catch (error) {

      console.error(
        'Update booking status error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to update booking status.'
      );
    }
  },
};


// =================================================
// NOTIFICATIONS GATEWAY
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
// EARNINGS GATEWAY
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
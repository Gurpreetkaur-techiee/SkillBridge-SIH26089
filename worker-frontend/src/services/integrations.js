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
  serverTimestamp,
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
        await getDoc(workerRef);

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
   * Get bookings for the logged-in worker
   *
   * Available Jobs includes:
   *
   * 1. Pending/open bookings assigned to this worker.
   * 2. Pending/open bookings with no worker assigned.
   *
   * Bookings assigned to another worker are excluded.
   */
  async getAvailableBookings() {
    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        'Please login first.'
      );
    }

    console.log(
      '[SkillBridge] Worker UID:',
      user.uid
    );

    try {
      const bookingsRef =
        collection(
          db,
          'bookings'
        );

      // -------------------------------------------------
      // Load all bookings.
      // -------------------------------------------------

      const snapshot =
        await getDocs(
          bookingsRef
        );

      console.log(
        '[SkillBridge] Total Firestore bookings:',
        snapshot.size
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

              updatedAt:
                data.updatedAt?.toDate
                  ? data.updatedAt
                      .toDate()
                      .toISOString()
                  : data.updatedAt,
            };
          }
        );

      console.log(
        '[SkillBridge] All Firestore bookings:',
        bookings
      );

console.table(
  bookings.map((booking) => ({
    id: booking.id,
    status: booking.status,
    statusLabel: booking.statusLabel,
    workerId: booking.workerId,
    workerName: booking.workerName,
    currentWorkerId: user.uid,
    workerIdMatches: booking.workerId === user.uid,
  }))
);

      // -------------------------------------------------
      // Filter bookings for this worker.
      // -------------------------------------------------

      const availableBookings =
        bookings.filter(
          (booking) => {
            const status =
              booking.status ||
              'pending';

            const isActiveStatus =
              status === 'pending' ||
              status === 'open';

            if (!isActiveStatus) {
              return false;
            }

            // No worker assigned yet.
            if (!booking.workerId) {
              return true;
            }

            // Booking assigned to this worker.
            if (
              booking.workerId ===
              user.uid
            ) {
              return true;
            }

            // Assigned to somebody else.
            return false;
          }
        );

      // -------------------------------------------------
      // Sort newest first.
      // -------------------------------------------------

      availableBookings.sort(
        (a, b) => {
          const timeA =
            a.createdAt
              ? new Date(
                  a.createdAt
                ).getTime()
              : 0;

          const timeB =
            b.createdAt
              ? new Date(
                  b.createdAt
                ).getTime()
              : 0;

          return timeB - timeA;
        }
      );

      console.log(
        '[SkillBridge] Available worker bookings:',
        availableBookings
      );

      return availableBookings;

    } catch (error) {
      console.error(
        '[SkillBridge] Get available bookings error:',
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

      const booking = {
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
        bookingData.workerId !==
          user.uid
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

      const updateData = {
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
// FIRESTORE
// =================================================

export const notificationsGateway = {
  /**
   * Get logged-in worker notifications.
   *
   * IMPORTANT:
   * Only notifications connected to a currently
   * available job are returned.
   *
   * Rules:
   * - Notification must be a booking request.
   * - Notification must have a bookingId.
   * - The booking must still be available.
   * - Only one notification is shown per booking.
   */
  async getNotifications() {
    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        'Please login first.'
      );
    }

    try {
      // ---------------------------------------------
      // Get the worker's current available jobs.
      // ---------------------------------------------
      const availableBookings =
        await bookingsGateway.getAvailableBookings();

      const availableBookingIds =
        new Set(
          availableBookings
            .map(
              (booking) =>
                booking.id
            )
            .filter(Boolean)
        );

      // ---------------------------------------------
      // Get notifications for this worker.
      // ---------------------------------------------
      const notificationsRef =
        collection(
          db,
          'notifications'
        );

      const q =
        query(
          notificationsRef,
          where(
            'workerId',
            '==',
            user.uid
          )
        );

      const snapshot =
        await getDocs(q);

      const notifications =
        snapshot.docs
          .map(
            (document) => {
              const data =
                document.data();

              return {
                id:
                  document.id,

                ...data,

                timestamp:
                  data.createdAt?.toDate
                    ? data.createdAt
                        .toDate()
                        .toLocaleString()
                    : data.timestamp ||
                      'Just now',
              };
            }
          )

          // -----------------------------------------
          // Only show active Available Jobs.
          // -----------------------------------------
          .filter(
            (notification) =>
              notification.type ===
                'booking_request' &&
              notification.bookingId &&
              availableBookingIds.has(
                notification.bookingId
              )
          );

      // ---------------------------------------------
      // Newest notifications first.
      // ---------------------------------------------
      notifications.sort(
        (a, b) => {
          const aTime =
            a.createdAt?.toMillis
              ? a.createdAt.toMillis()
              : 0;

          const bTime =
            b.createdAt?.toMillis
              ? b.createdAt.toMillis()
              : 0;

          return bTime - aTime;
        }
      );

      // ---------------------------------------------
      // Remove duplicate notifications for the
      // same booking. Keep the newest one.
      // ---------------------------------------------
      const seenBookingIds =
        new Set();

      const uniqueNotifications =
        notifications.filter(
          (notification) => {
            if (
              seenBookingIds.has(
                notification.bookingId
              )
            ) {
              return false;
            }

            seenBookingIds.add(
              notification.bookingId
            );

            return true;
          }
        );

      return uniqueNotifications;

    } catch (error) {
      console.error(
        'Get notifications error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to load notifications.'
      );
    }
  },

  /**
   * Add notification
   */
  async addNotification(
    notificationData
  ) {
    try {
      const notificationRef =
        doc(
          collection(
            db,
            'notifications'
          )
        );

      const notification = {
        ...notificationData,

        isRead:
          false,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      };

      await setDoc(
        notificationRef,
        notification
      );

      return {
        success: true,

        notification: {
          id:
            notificationRef.id,

          ...notification,
        },
      };

    } catch (error) {
      console.error(
        'Add notification error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to create notification.'
      );
    }
  },

  /**
   * Mark one notification as read
   */
  async markAsRead(
    notificationId
  ) {
    if (!notificationId) {
      throw new Error(
        'Notification ID is required.'
      );
    }

    try {
      const notificationRef =
        doc(
          db,
          'notifications',
          notificationId
        );

      await updateDoc(
        notificationRef,
        {
          isRead:
            true,

          updatedAt:
            serverTimestamp(),
        }
      );

      return {
        success: true,
      };

    } catch (error) {
      console.error(
        'Mark notification as read error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to mark notification as read.'
      );
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        'Please login first.'
      );
    }

    try {
      const notificationsRef =
        collection(
          db,
          'notifications'
        );

      const q =
        query(
          notificationsRef,

          where(
            'workerId',
            '==',
            user.uid
          ),

          where(
            'isRead',
            '==',
            false
          )
        );

      const snapshot =
        await getDocs(q);

      for (
        const notificationDoc
        of snapshot.docs
      ) {
        await updateDoc(
          notificationDoc.ref,
          {
            isRead:
              true,

            updatedAt:
              serverTimestamp(),
          }
        );
      }

      return {
        success: true,
      };

    } catch (error) {
      console.error(
        'Mark all notifications as read error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to mark all notifications as read.'
      );
    }
  },
};


// =================================================
// EARNINGS GATEWAY
// FIRESTORE
// =================================================

export const earningsGateway = {
  /**
   * Get earnings from completed bookings
   */
  async getEarningsSummary() {
    const user = auth.currentUser;

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
        await getDocs(q);

      const completedBookings =
        snapshot.docs
          .map((document) => {
            const data =
              document.data();

            return {
              id:
                document.id,

              ...data,

              completedAt:
                data.completedAt?.toDate
                  ? data.completedAt
                      .toDate()
                  : data.completedAt,

              createdAt:
                data.createdAt?.toDate
                  ? data.createdAt
                      .toDate()
                  : data.createdAt,
            };
          })
          .filter(
            (booking) =>
              booking.status ===
              'completed'
          );

      // ---------------------------------------------
      // Calculate total earnings
      // ---------------------------------------------

      const totalEarnings =
        completedBookings.reduce(
          (total, booking) => {
            const amount =
              Number(
                booking.estimatedPayout ??
                booking.amount ??
                0
              );

            return total + amount;
          },
          0
        );

      // ---------------------------------------------
      // Calculate this month's earnings
      // ---------------------------------------------

      const now =
        new Date();

      const thisMonth =
        completedBookings.reduce(
          (total, booking) => {
            const completedDate =
              booking.completedAt
                ? new Date(
                    booking.completedAt
                  )
                : null;

            if (
              !completedDate ||
              Number.isNaN(
                completedDate.getTime()
              )
            ) {
              return total;
            }

            if (
              completedDate.getMonth() !==
                now.getMonth() ||
              completedDate.getFullYear() !==
                now.getFullYear()
            ) {
              return total;
            }

            return (
              total +
              Number(
                booking.estimatedPayout ??
                booking.amount ??
                0
              )
            );
          },
          0
        );

      // ---------------------------------------------
      // Build transaction history
      // ---------------------------------------------

      const transactions =
        completedBookings
          .map((booking) => ({
            id:
              `tx-${booking.id}`,

            bookingId:
              booking.id,

            serviceTitle:
              booking.title ||
              booking.serviceName ||
              booking.serviceCategory ||
              'Service Request',

            customerName:
              booking.customerName ||
              'Customer',

            date:
              booking.completedAt
                ? new Date(
                    booking.completedAt
                  )
                    .toISOString()
                    .split('T')[0]
                : new Date()
                    .toISOString()
                    .split('T')[0],

            completedAt:
              booking.completedAt,

            amount:
              Number(
                booking.estimatedPayout ??
                booking.amount ??
                0
              ),

            status:
              'settled',
          }))
          .sort(
            (a, b) =>
              new Date(
                b.completedAt || b.date
              ).getTime() -
              new Date(
                a.completedAt || a.date
              ).getTime()
          );

      // ---------------------------------------------
      // Build monthly breakdown
      // Last 6 months including current month
      // ---------------------------------------------

      const monthlyBreakdown = [];

      for (
        let i = 5;
        i >= 0;
        i--
      ) {
        const date =
          new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
          );

        const monthAmount =
          completedBookings.reduce(
            (total, booking) => {
              const completedDate =
                booking.completedAt
                  ? new Date(
                      booking.completedAt
                    )
                  : null;

              if (
                !completedDate ||
                Number.isNaN(
                  completedDate.getTime()
                )
              ) {
                return total;
              }

              if (
                completedDate.getMonth() !==
                  date.getMonth() ||
                completedDate.getFullYear() !==
                  date.getFullYear()
              ) {
                return total;
              }

              return (
                total +
                Number(
                  booking.estimatedPayout ??
                  booking.amount ??
                  0
                )
              );
            },
            0
          );

        monthlyBreakdown.push({
          month:
            date.toLocaleString(
              'en-US',
              {
                month: 'short',
              }
            ),

          amount:
            monthAmount,
        });
      }

      return {
        totalEarnings,
        thisMonth,

        // Completed jobs are already treated
        // as settled earnings.
        pendingPayouts: 0,

        completedJobsCount:
          completedBookings.length,

        transactions,

        monthlyBreakdown,
      };

    } catch (error) {
      console.error(
        'Get earnings summary error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to load earnings.'
      );
    }
  },

  /**
   * Get completed booking transactions
   */
  async getTransactions() {
    const summary =
      await this.getEarningsSummary();

    return summary.transactions;
  },
};
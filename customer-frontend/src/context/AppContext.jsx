import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import {
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore';

import {
  onAuthStateChanged
} from 'firebase/auth';

import {
  sampleNotifications
} from '../data/workersData';

import {
  auth,
  db
} from '../firebase';

import {
  getCustomerBookings,
  cancelCustomerBooking
} from '../services/bookingService';

const AppContext = createContext();

export function AppProvider({ children }) {
  // =================================================
  // NAVIGATION
  // =================================================

  const [activeTab, setActiveTab] = useState('home');

  // =================================================
  // SEARCH
  // =================================================

  const [searchQuery, setSearchQuery] = useState('');

  // =================================================
  // CATEGORY
  // =================================================

  const [selectedCategory, setSelectedCategory] =
    useState('all');

  // =================================================
  // SERVICE FILTERS
  // =================================================

  /*
   * Shared service filters used by:
   *
   * - Popular Services
   * - Find Workers
   *
   * Multiple services can be selected.
   *
   * Example:
   * ['electrician', 'plumber']
   *
   * means:
   * show electricians OR plumbers.
   */
  const [
    selectedServiceFilters,
    setSelectedServiceFilters
  ] = useState([]);

  // =================================================
  // SERVICE DETECTION
  // =================================================

  const [detectedService, setDetectedService] =
    useState('unknown');

  const [serviceConfidence, setServiceConfidence] =
    useState(0);

  // =================================================
  // LOCATION
  // =================================================

  const [userLocation, setUserLocation] =
    useState('Downtown Metro Area');

  const [isLocating, setIsLocating] =
    useState(false);

  const [locationDetected, setLocationDetected] =
    useState(false);

  const [locationCoords, setLocationCoords] =
    useState(null);

  // =================================================
  // SELECTED ITEMS
  // =================================================

  const [selectedService, setSelectedService] =
    useState(null);

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  // =================================================
  // BOOKINGS
  // =================================================

  const [bookings, setBookings] =
    useState([]);

  // =================================================
  // NOTIFICATIONS
  // =================================================

  const [notifications, setNotifications] =
    useState(sampleNotifications);

  // =================================================
  // USER PROFILE
  // =================================================

  const [userProfile, setUserProfile] =
    useState({
      name: '',
      email: '',
      phone: '',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      address: 'Location unavailable',
      savedAddresses: []
    });

  // =================================================
  // LOAD CURRENT CUSTOMER PROFILE + BOOKINGS
  // =================================================

  useEffect(() => {
    let unsubscribe;

    const setupAuthListener = () => {
      unsubscribe = onAuthStateChanged(
        auth,
        async (currentUser) => {
          // -----------------------------------------
          // Logged out
          // -----------------------------------------

          if (!currentUser) {
            setBookings([]);

            setUserProfile({
              name: '',
              email: '',
              phone: '',
              avatar:
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
              address: 'Location unavailable',
              savedAddresses: []
            });

            return;
          }

          // -----------------------------------------
          // Logged in
          // -----------------------------------------

          try {
            // Load ONLY this customer's bookings.
            const customerBookings =
              await getCustomerBookings(
                currentUser.uid
              );

            setBookings(customerBookings);

          } catch (error) {
            console.error(
              'Error loading customer bookings:',
              error
            );

            setBookings([]);
          }

          // -----------------------------------------
          // Update profile information from
          // Firebase Authentication.
          // -----------------------------------------

          setUserProfile((previousProfile) => ({
            ...previousProfile,

            name:
              currentUser.displayName ||
              previousProfile.name ||
              'Customer',

            email:
              currentUser.email ||
              previousProfile.email ||
              '',

            avatar:
              currentUser.photoURL ||
              previousProfile.avatar
          }));
        }
      );
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // =================================================
  // NOTIFICATION COUNT
  // =================================================

  const unreadNotificationsCount =
    notifications.filter(
      (notification) => notification.unread
    ).length;

  // =================================================
  // DETECT USER LOCATION
  // =================================================

  const detectLocation = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat =
            position.coords.latitude.toFixed(4);

          const lng =
            position.coords.longitude.toFixed(4);

          setLocationCoords({
            lat,
            lng
          });

          setUserLocation(
            `Near Location (${lat}, ${lng})`
          );

          setLocationDetected(true);

          setIsLocating(false);
        },
        () => {
          setUserLocation(
            'Location unavailable'
          );

          setLocationDetected(false);

          setIsLocating(false);
        },
        {
          timeout: 5000
        }
      );
    } else {
      setUserLocation(
        'Location unavailable'
      );

      setLocationDetected(false);

      setIsLocating(false);
    }
  };

  // =================================================
  // MARK ALL NOTIFICATIONS READ
  // =================================================

  const markAllNotificationsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false
      }))
    );
  };

  // =================================================
  // CREATE BOOKING IN FIRESTORE
  // =================================================

  const createBooking = async (
    service,
    worker,
    notes = ''
  ) => {
    const currentUser = auth.currentUser;

    // A booking must belong to a logged-in customer.
    if (!currentUser) {
      throw new Error(
        'Please login before creating a booking.'
      );
    }

    // Worker Firebase UID.
    const workerId =
      worker?.id ||
      worker?.uid ||
      null;

    // =================================================
    // SERVICE KEY
    // =================================================

    /*
     * service.id is the language-neutral service key.
     *
     * Examples:
     * - electrician
     * - plumber
     * - cleaner
     * - carpenter
     * - mechanic
     *
     * This is stored separately from serviceName so
     * the Worker portal can use its translation system.
     */
    const serviceCategory =
      service?.id ||
      service?.serviceCategory ||
      'general';

    const bookingData = {
      // ---------------------------------------------
      // CUSTOMER
      // ---------------------------------------------

      customerId:
        currentUser.uid,

      customerName:
        currentUser.displayName ||
        userProfile.name ||
        'Customer',

      customerEmail:
        currentUser.email ||
        userProfile.email ||
        '',

      // ---------------------------------------------
      // WORKER
      // ---------------------------------------------

      workerId,

      workerName: worker
        ? worker.name
        : 'Assigned Pro (Dispatching)',

      workerAvatar: worker
        ? worker.avatar
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',

      // ---------------------------------------------
      // SERVICE
      // ---------------------------------------------

      title:
        service?.title ||
        'Service Request',

      serviceName:
        service?.title ||
        'Service Request',

      /*
       * IMPORTANT:
       * Store the internal service key, not the
       * translated display text.
       */
      serviceCategory,

      /*
       * Keep the broad service category as well.
       */
      category:
        service?.category ||
        'Other',

      // ---------------------------------------------
      // BOOKING DETAILS
      // ---------------------------------------------

      date:
        'Scheduled for Today',

      status:
        'pending',

      statusLabel:
        'Booking Pending',

      amount:
        Number(service?.price) || 0,

      estimatedPayout:
        Number(service?.price) || 0,

      currency:
        'INR',

      address:
        userProfile.address,

      eta:
        '15-30 mins',

      notes:
        notes
    };

    try {
      // =================================================
      // 1. CREATE BOOKING
      // =================================================

      const docRef =
        await addDoc(
          collection(
            db,
            'bookings'
          ),
          {
            ...bookingData,

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp()
          }
        );

      const firebaseBooking = {
        id: docRef.id,

        firebaseId:
          docRef.id,

        ...bookingData
      };

      // Add only the booking created by the
      // current customer to local state.
      setBookings((previous) => [
        firebaseBooking,
        ...previous
      ]);

      // =================================================
      // 2. CREATE WORKER NOTIFICATION
      // =================================================

      // Only send notification when a specific
      // worker was selected.
      if (workerId) {
        try {
          await addDoc(
            collection(
              db,
              'notifications'
            ),
            {
              workerId,

              type:
                'booking_request',

              bookingId:
                docRef.id,

              title:
                'New Booking Request',

              message:
                `${bookingData.customerName} requested ${service?.title || 'a service'} at ${userProfile.address}.`,

              /*
               * Store the same language-neutral service
               * key in the notification so the Worker
               * portal can translate it if needed.
               */
              serviceCategory,

              isRead:
                false,

              createdAt:
                serverTimestamp(),

              updatedAt:
                serverTimestamp()
            }
          );

          console.log(
            'Worker notification created successfully.'
          );

        } catch (notificationError) {
          // Booking is already created.
          // Do not cancel the booking if the
          // notification fails.
          console.error(
            'Booking created, but worker notification failed:',
            notificationError
          );
        }
      } else {
        console.log(
          'No specific worker selected. Worker notification skipped.'
        );
      }

      // =================================================
      // 3. CUSTOMER LOCAL NOTIFICATION
      // =================================================

      const newNotification = {
        id:
          `notif-${Date.now()}`,

        title:
          `Booking Confirmed: ${service?.title || 'Service Request'}!`,

        message:
          `Your booking has been received. A pro is being dispatched to ${userProfile.address}.`,

        time:
          'Just now',

        unread:
          true,

        type:
          'booking'
      };

      setNotifications(
        (previous) => [
          newNotification,
          ...previous
        ]
      );

      return firebaseBooking;

    } catch (error) {
      console.error(
        'Error creating booking in Firestore:',
        error
      );

      throw error;
    }
  };

  // =================================================
  // REMOVE CUSTOMER BOOKING
  // =================================================

  const removeBooking = async (bookingId) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error(
        'Please login before removing a booking.'
      );
    }

    if (!bookingId) {
      throw new Error(
        'Booking ID is required.'
      );
    }

    try {
      // Remove the booking from Firestore.
      // The service also verifies that the booking
      // belongs to the current customer.
      await cancelCustomerBooking(
        bookingId,
        currentUser.uid
      );

      // Remove it from the local Customer portal
      // immediately after successful deletion.
      setBookings((previous) =>
        previous.filter(
          (booking) =>
            booking.id !== bookingId &&
            booking.firebaseId !== bookingId
        )
      );

      // Add a local notification.
      const cancellationNotification = {
        id:
          `notif-${Date.now()}`,

        title:
          'Booking Cancelled',

        message:
          'Your booking has been removed successfully.',

        time:
          'Just now',

        unread:
          true,

        type:
          'booking'
      };

      setNotifications(
        (previous) => [
          cancellationNotification,
          ...previous
        ]
      );

      return true;

    } catch (error) {
      console.error(
        'Error removing booking:',
        error
      );

      throw error;
    }
  };

  // =================================================
  // CONTEXT
  // =================================================

  return (
    <AppContext.Provider
      value={{
        // ---------------------------------------------
        // Navigation
        // ---------------------------------------------

        activeTab,
        setActiveTab,

        // ---------------------------------------------
        // Search
        // ---------------------------------------------

        searchQuery,
        setSearchQuery,

        // ---------------------------------------------
        // Category
        // ---------------------------------------------

        selectedCategory,
        setSelectedCategory,

        // ---------------------------------------------
        // Service Filters
        // ---------------------------------------------

        selectedServiceFilters,
        setSelectedServiceFilters,

        // ---------------------------------------------
        // Service Detection
        // ---------------------------------------------

        detectedService,
        setDetectedService,

        serviceConfidence,
        setServiceConfidence,

        // ---------------------------------------------
        // Location
        // ---------------------------------------------

        userLocation,
        setUserLocation,

        isLocating,

        locationDetected,

        locationCoords,

        detectLocation,

        // ---------------------------------------------
        // Selected Service
        // ---------------------------------------------

        selectedService,
        setSelectedService,

        // ---------------------------------------------
        // Selected Worker
        // ---------------------------------------------

        selectedWorker,
        setSelectedWorker,

        // ---------------------------------------------
        // Customer Bookings
        // ---------------------------------------------

        bookings,

        createBooking,

        removeBooking,

        // ---------------------------------------------
        // Notifications
        // ---------------------------------------------

        notifications,

        unreadNotificationsCount,

        markAllNotificationsRead,

        // ---------------------------------------------
        // User Profile
        // ---------------------------------------------

        userProfile,

        setUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
}
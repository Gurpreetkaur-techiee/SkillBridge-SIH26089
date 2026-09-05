import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

import {
  sampleWorkers,
  sampleCustomerBookings,
  sampleNotifications
} from '../data/workersData';

import { auth, db } from '../firebase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [detectedService, setDetectedService] = useState('unknown');
  const [serviceConfidence, setServiceConfidence] = useState(0);

  // Location
  const [userLocation, setUserLocation] = useState('Downtown Metro Area');
  const [isLocating, setIsLocating] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);

  // Selected items
  const [selectedService, setSelectedService] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Bookings
  const [bookings, setBookings] = useState([]);

  // Notifications
  const [notifications, setNotifications] = useState(sampleNotifications);

  // User profile
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    address: '742 Evergreen Terrace, Apt 4B, Springfield',
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home',
        address: '742 Evergreen Terrace, Apt 4B, Springfield',
        isDefault: true
      },
      {
        id: 'addr-2',
        label: 'Office',
        address: '100 Innovation Parkway, Suite 300',
        isDefault: false
      }
    ]
  });

  // Load bookings from Firestore
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'bookings'));

        const firebaseBookings = snapshot.docs.map((doc) => ({
          firebaseId: doc.id,
          ...doc.data()
        }));

        setBookings(firebaseBookings);
      } catch (error) {
        console.error('Error loading bookings from Firebase:', error);

        // No fake backend fallback
        setBookings([]);
      }
    };

    loadBookings();
  }, []);

  const unreadNotificationsCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  // Detect user location
  const detectLocation = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);

          setLocationCoords({ lat, lng });
          setUserLocation(`Near Location (${lat}, ${lng})`);
          setLocationDetected(true);
          setIsLocating(false);
        },
        () => {
          setUserLocation('Location unavailable');
          setLocationDetected(false);
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setUserLocation('Location unavailable');
      setLocationDetected(false);
      setIsLocating(false);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false
      }))
    );
  };

  // Create booking in Firestore
  const createBooking = async (service, worker, notes = '') => {
    const currentUser = auth.currentUser;

    // Worker Firebase UID
    const workerId = worker?.id || worker?.uid || null;

    const bookingData = {
      customerId: currentUser?.uid || null,
      customerName:
        currentUser?.displayName ||
        userProfile.name ||
        'Customer',
      customerEmail:
        currentUser?.email ||
        userProfile.email ||
        '',
      workerId: workerId,

      serviceName: service.title,
      category: service.category,

      workerName: worker
        ? worker.name
        : 'Assigned Pro (Dispatching)',

      workerAvatar: worker
        ? worker.avatar
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',

      date: 'Scheduled for Today',
      status: 'pending',
      statusLabel: 'Booking Pending',
      amount: Number(service.price) || 0,
      address: userProfile.address,
      eta: '15-30 mins',
      notes: notes
    };

    try {
      // --------------------------------------------------
      // 1. CREATE BOOKING
      // --------------------------------------------------
      const docRef = await addDoc(
        collection(db, 'bookings'),
        {
          ...bookingData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      );

      const firebaseBooking = {
        id: docRef.id,
        firebaseId: docRef.id,
        ...bookingData
      };

      setBookings((prev) => [
        firebaseBooking,
        ...prev
      ]);

      // --------------------------------------------------
      // 2. CREATE WORKER NOTIFICATION
      // --------------------------------------------------
      // Only send notification when a specific worker
      // was selected.
      if (workerId) {
        try {
          await addDoc(
            collection(db, 'notifications'),
            {
              workerId: workerId,

              type: 'booking_request',

              bookingId: docRef.id,

              title: 'New Booking Request',

              message: `${bookingData.customerName} requested ${service.title} at ${userProfile.address}.`,

              isRead: false,

              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }
          );

          console.log(
            'Worker notification created successfully.'
          );
        } catch (notificationError) {
          // Booking is already created, so don't cancel it
          // just because notification creation failed.
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

      // --------------------------------------------------
      // 3. CUSTOMER LOCAL NOTIFICATION
      // --------------------------------------------------
      const newNotification = {
        id: `notif-${Date.now()}`,

        title: `Booking Confirmed: ${service.title}!`,

        message: `Your booking has been received. A pro is being dispatched to ${userProfile.address}.`,

        time: 'Just now',

        unread: true,

        type: 'booking'
      };

      setNotifications((prev) => [
        newNotification,
        ...prev
      ]);

      return firebaseBooking;

    } catch (error) {
      console.error(
        'Error creating booking in Firestore:',
        error
      );

      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,

        searchQuery,
        setSearchQuery,

        selectedCategory,
        setSelectedCategory,

        detectedService,
        setDetectedService,

        serviceConfidence,
        setServiceConfidence,

        userLocation,
        setUserLocation,
        isLocating,
        locationDetected,
        locationCoords,
        detectLocation,

        selectedService,
        setSelectedService,

        selectedWorker,
        setSelectedWorker,

        bookings,
        createBooking,

        notifications,
        unreadNotificationsCount,
        markAllNotificationsRead,

        userProfile,
        setUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
}
import React, { createContext, useContext, useState } from 'react';
import { sampleWorkers, sampleCustomerBookings, sampleNotifications } from '../data/workersData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'workers' | 'bookings' | 'notifications' | 'profile'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Location state
  const [userLocation, setUserLocation] = useState('Downtown Metro Area');
  const [isLocating, setIsLocating] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);

  // Modals & Active state
  const [selectedService, setSelectedService] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookings, setBookings] = useState(sampleCustomerBookings);
  const [notifications, setNotifications] = useState(sampleNotifications);

  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
    address: "742 Evergreen Terrace, Apt 4B, Springfield",
    savedAddresses: [
      { id: "addr-1", label: "Home", address: "742 Evergreen Terrace, Apt 4B, Springfield", isDefault: true },
      { id: "addr-2", label: "Office", address: "100 Innovation Parkway, Suite 300", isDefault: false }
    ]
  });

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

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
        (error) => {
          // Graceful fallback simulation
          setTimeout(() => {
            setUserLocation("Austin Central District (Detected)");
            setLocationCoords({ lat: 30.2672, lng: -97.7431 });
            setLocationDetected(true);
            setIsLocating(false);
          }, 800);
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setUserLocation("San Francisco Bay Area (Detected)");
        setLocationDetected(true);
        setIsLocating(false);
      }, 600);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const createBooking = (service, worker, notes = '') => {
    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceName: service.title,
      category: service.category,
      workerName: worker ? worker.name : "Assigned Pro (Dispatching)",
      workerAvatar: worker ? worker.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      date: "Scheduled for Today",
      status: "in_progress",
      statusLabel: "Pro Dispatched",
      amount: `$${service.price}.00`,
      address: userProfile.address,
      eta: "15-30 mins"
    };

    setBookings(prev => [newBooking, ...prev]);
    
    // Add notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `Booking Confirmed: ${service.title}! 🎉`,
      message: `Your booking #${newBooking.id} has been received. A pro is being dispatched to ${userProfile.address}.`,
      time: "Just now",
      unread: true,
      type: "booking"
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newBooking;
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
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

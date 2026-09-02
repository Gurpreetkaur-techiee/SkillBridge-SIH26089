/**
 * SkillBridge Worker Frontend Integration Layer
 *
 * This module acts as the contract/gateway layer between the React UI
 * and future backend services / REST / GraphQL APIs.
 */

/**
 * DATA CONTRACT SCHEMA (Booking Object):
 *
 * {
 *   id: string,
 *   serviceCategory: string,
 *   title: string,
 *   problemDescription: string,
 *   customerName: string,
 *   customerPhone: string,
 *   customerEmail: string,
 *   locationAddress: string,
 *   city: string,
 *   distanceKm: number,
 *   estimatedPayout: number,
 *   estimatedHours: string,
 *   date: string,
 *   time: string,
 *   isUrgent: boolean,
 *   status: string,
 *   createdAt: string
 * }
 */

// Default initial worker profile state for a newly logged-in service professional
const DEFAULT_WORKER_PROFILE = {
  id: 'w-101',
  fullName: 'Rajesh Kumar',
  email: 'rajesh.kumar@skillbridge.pro',
  phone: '+91 98765 43210',
  avatarUrl: null,
  primaryService: 'electrician',
  secondarySkills: ['Wiring', 'Appliance Setup', 'Circuit Breakers', 'Inverters'],
  experienceYears: 6,
  serviceArea: 'South Delhi & NCR',
  serviceRadiusKm: 15,
  hourlyRate: 400,
  bio: 'Certified master electrician with 6+ years of experience in domestic and commercial electrical installations, safety inspections, and high-voltage repairs.',
  rating: 4.9,
  reviewsCount: 48,
  completedJobsCount: 132,
  isAvailable: true,
  languages: ['English', 'Hindi', 'Punjabi'],
  verified: true,
  memberSince: '2024-03-15',
};

let activeWorker = { ...DEFAULT_WORKER_PROFILE };

let availableBookingsState = [];
let myBookingsState = [];
let notificationsState = [];

let earningsState = {
  totalEarnings: 0,
  thisMonth: 0,
  pendingPayouts: 0,
  completedJobsCount: 0,
  transactions: [],
  monthlyBreakdown: [
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: 0 },
    { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 0 },
    { month: 'May', amount: 0 },
    { month: 'Jun', amount: 0 },
  ],
};

/**
 * Authentication Gateway
 */
export const authGateway = {
  /**
   * Worker Login
   * @param {string} email
   * @param {string} password
   * @param {boolean} rememberMe
   */
  async login(email, password, rememberMe = false) {
    await delay();
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    // Set active worker email
    activeWorker.email = email;
    if (email.includes('@')) {
      const namePart = email.split('@')[0].replace('.', ' ');
      activeWorker.fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return {
      success: true,
      token: 'jwt-skillbridge-worker-sample-token',
      worker: { ...activeWorker },
    };
  },

  /**
   * Worker Registration
   * @param {Object} registrationData
   */
  async registerWorker(registrationData) {
    await delay();
    if (!registrationData.email || !registrationData.fullName || !registrationData.primaryService) {
      throw new Error('Please fill in all required registration fields.');
    }

    activeWorker = {
      ...DEFAULT_WORKER_PROFILE,
      ...registrationData,
      id: 'w-' + Math.floor(Math.random() * 10000),
      rating: 5.0,
      reviewsCount: 0,
      completedJobsCount: 0,
      isAvailable: true,
      verified: true,
      memberSince: new Date().toISOString().split('T')[0],
    };

    return {
      success: true,
      worker: { ...activeWorker },
    };
  },

  /**
   * Worker Logout
   */
  async logout() {
    await delay(100);
    return { success: true };
  },

  /**
   * Get Current Session
   */
  async getCurrentWorker() {
    await delay(100);
    return { ...activeWorker };
  },
};

/**
 * Worker Profile Gateway
 */
export const workerGateway = {
  /**
   * Fetch worker profile details
   */
  async getProfile() {
    await delay();
    return { ...activeWorker };
  },

  /**
   * Update worker profile
   * @param {Object} updates
   */
  async updateProfile(updates) {
    await delay();
    activeWorker = { ...activeWorker, ...updates };
    return {
      success: true,
      worker: { ...activeWorker },
    };
  },

  /**
   * Toggle or set worker online/available status
   * @param {boolean} isAvailable
   */
  async setAvailability(isAvailable) {
    await delay(150);
    activeWorker.isAvailable = isAvailable;
    return {
      success: true,
      isAvailable: activeWorker.isAvailable,
    };
  },

  /**
   * Get Worker Settings
   */
  async getSettings() {
    await delay(100);
    return {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      serviceRadiusKm: activeWorker.serviceRadiusKm || 15,
      autoAcceptNearby: false,
    };
  },

  /**
   * Update Worker Settings
   */
  async updateSettings(settings) {
    await delay();
    return { success: true, settings };
  },
};

/**
 * Bookings Gateway
 */
export const bookingsGateway = {
  /**
   * Fetch available booking requests in worker's area
   * @param {Object} filters
   */
  async getAvailableBookings(filters = {}) {
    await delay();
    let results = [...availableBookingsState];

    if (filters.category && filters.category !== 'all') {
      results = results.filter((b) => b.serviceCategory === filters.category);
    }
    if (filters.maxDistance) {
      results = results.filter((b) => b.distanceKm <= filters.maxDistance);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.serviceCategory?.toLowerCase().includes(q) ||
          b.locationAddress?.toLowerCase().includes(q) ||
          b.problemDescription?.toLowerCase().includes(q)
      );
    }
    return results;
  },

  /**
   * Fetch single booking details by ID
   * @param {string} bookingId
   */
  async getBooking(bookingId) {
    await delay();
    const all = [...availableBookingsState, ...myBookingsState];
    const found = all.find((b) => b.id === bookingId);
    if (!found) {
      return null;
    }
    return found;
  },

  /**
   * Add a new incoming booking request (called by backend listener/websocket/API)
   * @param {Object} bookingRequest
   */
  async addBookingRequest(bookingRequest) {
    await delay(50);
    const newBooking = {
      id: bookingRequest.id || 'BK-' + Math.floor(1000 + Math.random() * 9000),
      serviceCategory: bookingRequest.serviceCategory || 'electrician',
      title: bookingRequest.title || 'Service Request',
      problemDescription: bookingRequest.problemDescription || '',
      customerName: bookingRequest.customerName || 'Customer',
      customerPhone: bookingRequest.customerPhone || '',
      customerEmail: bookingRequest.customerEmail || '',
      locationAddress: bookingRequest.locationAddress || 'Local Address',
      city: bookingRequest.city || 'Delhi',
      distanceKm: bookingRequest.distanceKm || 3.5,
      estimatedPayout: bookingRequest.estimatedPayout || 400,
      estimatedHours: bookingRequest.estimatedHours || '1-2',
      date: bookingRequest.date || new Date().toISOString().split('T')[0],
      time: bookingRequest.time || '10:00 AM',
      isUrgent: !!bookingRequest.isUrgent,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    availableBookingsState.unshift(newBooking);
    return newBooking;
  },

  /**
   * Accept an available booking request
   * @param {string} bookingId
   */
  async acceptBooking(bookingId) {
    await delay();
    const index = availableBookingsState.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      throw new Error('Booking request not found or expired.');
    }
    const accepted = {
      ...availableBookingsState[index],
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    };
    availableBookingsState.splice(index, 1);
    myBookingsState.unshift(accepted);
    return { success: true, booking: accepted };
  },

  /**
   * Reject/Decline a booking request
   * @param {string} bookingId
   * @param {string} reason
   */
  async rejectBooking(bookingId, reason = '') {
    await delay();
    const index = availableBookingsState.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      const rejected = {
        ...availableBookingsState[index],
        status: 'rejected',
        rejectedReason: reason,
      };
      availableBookingsState.splice(index, 1);
      myBookingsState.push(rejected);
    }
    return { success: true, bookingId };
  },

  /**
   * Fetch worker's assigned bookings (upcoming, active, completed, cancelled)
   * @param {string} statusFilter
   */
  async getMyBookings(statusFilter = 'all') {
    await delay();
    if (!statusFilter || statusFilter === 'all') {
      return [...myBookingsState];
    }
    return myBookingsState.filter((b) => b.status === statusFilter);
  },

  /**
   * Update booking status (e.g., start job, mark completed)
   * @param {string} bookingId
   * @param {string} newStatus
   */
  async updateBookingStatus(bookingId, newStatus) {
    await delay();
    const booking = myBookingsState.find((b) => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found in your assignments.');
    }
    booking.status = newStatus;
    if (newStatus === 'completed') {
      booking.completedAt = new Date().toISOString();
      earningsState.completedJobsCount += 1;
      earningsState.totalEarnings += booking.estimatedPayout || 0;
      earningsState.thisMonth += booking.estimatedPayout || 0;
      earningsState.transactions.unshift({
        id: 'tx-' + Math.floor(Math.random() * 100000),
        bookingId: booking.id,
        serviceTitle: booking.title,
        customerName: booking.customerName,
        date: new Date().toISOString().split('T')[0],
        completedAt: booking.completedAt,
        amount: booking.estimatedPayout || 0,
        status: 'settled',
      });
    }
    return { success: true, booking };
  },
};

/**
 * Notifications Gateway
 */
export const notificationsGateway = {
  /**
   * Fetch notifications list
   */
  async getNotifications() {
    await delay();
    return [...notificationsState];
  },

  /**
   * Add a notification (called by backend events)
   * @param {Object} notification
   */
  async addNotification(notification) {
    await delay(50);
    const item = {
      id: 'notif-' + Date.now(),
      type: notification.type || 'system',
      title: notification.title || 'Notification',
      message: notification.message || '',
      timestamp: 'Just now',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notificationsState.unshift(item);
    return item;
  },

  /**
   * Mark single notification as read
   * @param {string} notificationId
   */
  async markAsRead(notificationId) {
    await delay(100);
    const item = notificationsState.find((n) => n.id === notificationId);
    if (item) {
      item.isRead = true;
    }
    return { success: true };
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    await delay(100);
    notificationsState.forEach((n) => {
      n.isRead = true;
    });
    return { success: true };
  },
};

/**
 * Earnings Gateway
 */
export const earningsGateway = {
  /**
   * Fetch earnings metrics and breakdown
   */
  async getEarningsSummary() {
    await delay();
    return { ...earningsState };
  },

  /**
   * Fetch recent payout transactions
   */
  async getTransactions() {
    await delay();
    return [...earningsState.transactions];
  },
};

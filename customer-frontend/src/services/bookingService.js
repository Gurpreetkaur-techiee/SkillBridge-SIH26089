import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

import { db } from '../firebase';

// Save a booking to Firestore
export async function createFirestoreBooking(booking) {
  try {
    const bookingData = {
      ...booking,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(
      collection(db, 'bookings'),
      bookingData
    );

    return {
      id: docRef.id,
      ...bookingData
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// Get bookings for a customer
export async function getCustomerBookings(customerId) {
  try {
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(bookingsQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}
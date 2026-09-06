import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc
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
    if (!customerId) {
      throw new Error(
        'Customer ID is required.'
      );
    }

    /*
     * Query only by customerId.
     *
     * We intentionally do NOT use orderBy here.
     * This avoids requiring a Firestore composite
     * index for customerId + createdAt.
     */
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where(
        'customerId',
        '==',
        customerId
      )
    );

    const snapshot =
      await getDocs(
        bookingsQuery
      );

    const bookings =
      snapshot.docs.map(
        (bookingDoc) => ({
          id: bookingDoc.id,
          firebaseId: bookingDoc.id,
          ...bookingDoc.data()
        })
      );

    /*
     * Sort locally so the newest booking appears first.
     */
    bookings.sort(
      (a, b) => {
        const getTime = (value) => {
          if (!value) return 0;

          if (
            typeof value.toMillis ===
            'function'
          ) {
            return value.toMillis();
          }

          if (
            typeof value.toDate ===
            'function'
          ) {
            return value.toDate().getTime();
          }

          const parsed =
            new Date(value).getTime();

          return Number.isNaN(parsed)
            ? 0
            : parsed;
        };

        return (
          getTime(b.createdAt) -
          getTime(a.createdAt)
        );
      }
    );

    return bookings;

  } catch (error) {
    console.error(
      'Error fetching customer bookings:',
      error
    );

    throw error;
  }
}

// Remove a customer's booking
export async function cancelCustomerBooking(
  bookingId,
  customerId
) {
  try {
    if (!bookingId) {
      throw new Error('Booking ID is required.');
    }

    if (!customerId) {
      throw new Error('Customer ID is required.');
    }

    // First verify that the booking belongs to
    // the currently logged-in customer.
    const customerBookingsQuery = query(
      collection(db, 'bookings'),
      where('customerId', '==', customerId)
    );

    const snapshot = await getDocs(
      customerBookingsQuery
    );

    const bookingBelongsToCustomer =
      snapshot.docs.some(
        (bookingDoc) => bookingDoc.id === bookingId
      );

    if (!bookingBelongsToCustomer) {
      throw new Error(
        'You are not allowed to remove this booking.'
      );
    }

    const bookingRef = doc(
      db,
      'bookings',
      bookingId
    );

    await deleteDoc(bookingRef);

    return {
      success: true,
      bookingId
    };
  } catch (error) {
    console.error(
      'Error cancelling booking:',
      error
    );

    throw error;
  }
}
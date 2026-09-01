// FRONTEND HANDOFF: backend teammates should replace these functions with Firebase integrations.
const unavailable = (name) => Promise.reject(new Error(`${
name
} is waiting for Firebase integration.`));

export const authGateway = {
 login: (email,password,rememberMe)=>unavailable('login'), signup:(userData)=>unavailable('signup'), resetPassword:(email)=>unavailable('password reset'), restoreSession:()=>Promise.resolve(null) 
};

export const customerGateway = {
 getWorkers:(filters)=>unavailable('worker search'), getWorker:(id)=>unavailable('worker profile'), createBooking:(data)=>unavailable('booking creation'), getBookings:()=>unavailable('bookings'), getBooking:(id)=>unavailable('booking'), getNotifications:()=>unavailable('notifications'), startPayment:(booking)=>unavailable('Razorpay payment'), submitReview:(data)=>unavailable('review submission'), getCurrentLocation:()=>unavailable('location') 
};


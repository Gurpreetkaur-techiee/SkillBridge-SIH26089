import {
 Navigate, Route, Routes 
} from 'react-router-dom';

import Shell from './components/Shell/Shell';

import Login from './pages/Login/Login';
 import Signup from './pages/Signup/Signup';
 import ForgotPassword from './pages/ForgotPassword/ForgotPassword';

import Home from './pages/Home/Home';
 import SearchWorkers from './pages/SearchWorkers/SearchWorkers';
 import WorkerProfile from './pages/WorkerProfile/WorkerProfile';
 import Booking from './pages/Booking/Booking';
 import MyBookings from './pages/MyBookings/MyBookings';
 import BookingDetails from './pages/BookingDetails/BookingDetails';
 import Notifications from './pages/Notifications/Notifications';
 import Payment from './pages/Payment/Payment';
 import Review from './pages/Review/Review';
 import Profile from './pages/Profile/Profile';

const Customer = ({
 children 
}) => <Shell>{
children
}</Shell>;

export default function App() {
 return <Routes>
  <Route path="/" element={
<Navigate to="/customer" replace />
} />
  <Route path="/login" element={
<Login />
} />
<Route path="/signup" element={
<Signup />
} />
<Route path="/forgot-password" element={
<ForgotPassword />
} />
  <Route path="/customer" element={
<Customer>
<Home />
</Customer>
} />
<Route path="/customer/search" element={
<Customer>
<SearchWorkers />
</Customer>
} />
<Route path="/customer/worker/:workerId" element={
<Customer>
<WorkerProfile />
</Customer>
} />
<Route path="/customer/book/:workerId" element={
<Customer>
<Booking />
</Customer>
} />
<Route path="/customer/bookings" element={
<Customer>
<MyBookings />
</Customer>
} />
<Route path="/customer/bookings/:bookingId" element={
<Customer>
<BookingDetails />
</Customer>
} />
<Route path="/customer/notifications" element={
<Customer>
<Notifications />
</Customer>
} />
<Route path="/customer/payment/:bookingId" element={
<Customer>
<Payment />
</Customer>
} />
<Route path="/customer/review/:bookingId" element={
<Customer>
<Review />
</Customer>
} />
<Route path="/customer/profile" element={
<Customer>
<Profile />
</Customer>
} />
</Routes>;
 
}

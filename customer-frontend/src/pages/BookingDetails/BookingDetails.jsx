import {
useParams,Link
} from 'react-router-dom';
import EmptyState from '../../components/EmptyState/EmptyState';
import './BookingDetails.css';
export default function BookingDetails(){
const{
bookingId
}=useParams();
return <>
<Link className="back-link" to="/customer/bookings">← My bookings</Link>
<div className="page-title detail-title">
<p>Booking reference: {
bookingId
}</p>
<h1>Booking details</h1>
</div>
<EmptyState title="Booking details unavailable" description="Live worker, service, payment and status information will appear once the booking data integration is connected."/>
</>
}

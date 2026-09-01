import {
useParams
} from 'react-router-dom';
import {
CreditCard
} from 'lucide-react';
import './Payment.css';
export default function Payment(){
const{
bookingId
}=useParams();
return <>
<div className="page-title">
<p>Secure checkout</p>
<h1>Payment</h1>
</div>
<section className="payment-card">
<CreditCard/>
<h2>Payment is waiting for booking details</h2>
<p>Booking <code>{
bookingId
}</code> will provide the worker, service, amount and payment status. The payment teammate can connect Razorpay here.</p>
<button className="primary" disabled>Pay securely</button>
</section>
</>
}

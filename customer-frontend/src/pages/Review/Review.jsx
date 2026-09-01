import {
useState
} from 'react';
import {
useParams
} from 'react-router-dom';
import RatingStars from '../../components/RatingStars/RatingStars';
import './Review.css';
export default function Review(){
const{
bookingId
}=useParams(),[rating,setRating]=useState(0),[review,setReview]=useState('');
return <>
<div className="page-title">
<p>Booking {
bookingId
}</p>
<h1>Leave a review</h1>
</div>
<section className="review-card">
<p>Reviews are available only when the backend marks a completed booking as eligible.</p>
<RatingStars value={
rating
} onChange={
setRating
}/>
<label>Tell us about the service<textarea value={
review
} onChange={
e=>setReview(e.target.value)
} rows="5" placeholder="Write your feedback…"/>
</label>
<button className="primary" disabled>Submit review</button>
<small>This will be enabled when eligibility is supplied by the booking integration.</small>
</section>
</>
}

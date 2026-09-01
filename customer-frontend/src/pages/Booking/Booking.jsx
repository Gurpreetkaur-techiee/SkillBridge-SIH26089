import {
useState
} from 'react';
import {
useParams,useNavigate
} from 'react-router-dom';
import {
customerGateway
} from '../../services/integrations';
import './Booking.css';

export default function Booking(){
const{
workerId
}=useParams(),nav=useNavigate(),[data,setData]=useState({
service:'',date:'',time:'',location:'',address:'',description:''
}),[error,setError]=useState('');
const update=e=>setData({
...data,[e.target.name]:e.target.value
});
async function submit(e){
e.preventDefault();
if(Object.values(data).some(x=>!x))return setError('Please complete all booking details.');
try{
await customerGateway.createBooking({
...data,workerId
});
nav('/customer/bookings')
}catch(x){
setError(x.message)
}
}return <>
<div className="page-title">
<p>Request a service</p>
<h1>Book a worker</h1>
</div>
<form className="booking-form" onSubmit={
submit
}>{
error&&<p className="error-state">{
error
}</p>
}<label>Worker<input readOnly value={
`Worker ID: ${
workerId
}`
}/>
</label>
<label>Service<select name="service" value={
data.service
} onChange={
update
}>
<option value="">Select a service</option>
<option>Electrician</option>
<option>Plumber</option>
<option>Cleaner</option>
<option>Mechanic</option>
</select>
</label>
<div className="two-col">
<label>Date<input name="date" type="date" value={
data.date
} onChange={
update
}/>
</label>
<label>Time<input name="time" type="time" value={
data.time
} onChange={
update
}/>
</label>
</div>
<label>Service location<select name="location" value={
data.location
} onChange={
update
}>
<option value="">Choose an option</option>
<option>Use my current location</option>
<option>Enter address manually</option>
</select>
</label>
<label>Address<input name="address" value={
data.address
} onChange={
update
} placeholder="House / street / landmark"/>
</label>
<label>Describe your request<textarea name="description" rows="4" value={
data.description
} onChange={
update
}/>
</label>
<button className="primary">Send booking request</button>
</form>
</>
}

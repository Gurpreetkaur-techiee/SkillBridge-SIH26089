import {
Link,useParams
} from 'react-router-dom';
import {
MapPin
} from 'lucide-react';
import EmptyState from '../../components/EmptyState/EmptyState';
import './WorkerProfile.css';

export default function WorkerProfile(){
const{
workerId
}=useParams();
return <>
<Link className="back-link" to="/customer/search">← Back to results</Link>
<div className="profile-placeholder">
<MapPin/>
<h1>Worker profile</h1>
<p>Worker <code>{
workerId
}</code> will be loaded from the marketplace directory.</p>
</div>
<EmptyState title="Worker details are unavailable" description="The profile, availability, distance, services and reviews will appear after the Firebase data integration is supplied."/>
</>
}

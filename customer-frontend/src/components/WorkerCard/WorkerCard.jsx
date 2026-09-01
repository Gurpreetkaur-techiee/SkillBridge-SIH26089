import {
MapPin, Star
} from 'lucide-react';
 import {
Link
} from 'react-router-dom';
 import './WorkerCard.css';
 export default function WorkerCard({
worker
}){
if(!worker)return null;
return <article className="worker-card">
<img src={
worker.photoUrl
} alt=""/>
<div>
<h3>{
worker.name
}</h3>
<p>{
worker.services?.join(', ')
}</p>
<span>
<Star size={
14
}/> {
worker.rating
} · <MapPin size={
14
}/>{
worker.distance
}</span>
</div>
<Link to={
`/customer/worker/${
worker.id
}`
}>View</Link>
</article>
}

import {
 Inbox 
} from 'lucide-react';
 import './EmptyState.css';
 export default function EmptyState({
title='Nothing here yet',description='This will appear when your account data is available.'
}){
return <section className="state-card empty-state">
<Inbox size={
32
}/>
<h2>{
title
}</h2>
<p>{
description
}</p>
</section>
}

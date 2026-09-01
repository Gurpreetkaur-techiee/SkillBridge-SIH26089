import EmptyState from '../../components/EmptyState/EmptyState';
import {
useApp
} from '../../context/AppContext';
import './Notifications.css';
export default function Notifications(){
const{
t
}=useApp();
return <>
<div className="page-title">
<p>{
t('pages.stayUpdated')
}</p>
<h1>{
t('pages.notifications')
}</h1>
</div>
<EmptyState title={
t('pages.caughtUp')
} description={
t('pages.caughtUpText')
}/>
</>
}

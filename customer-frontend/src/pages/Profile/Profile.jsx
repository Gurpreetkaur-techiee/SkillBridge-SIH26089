import {
useState
} from 'react';
import {
Link,useNavigate
} from 'react-router-dom';
import {
CircleHelp,LogOut,MapPinned,Palette,ShieldCheck,UserRound
} from 'lucide-react';
import {
useApp
} from '../../context/AppContext';
import './Profile.css';

export default function Profile(){
const{
theme,language,setTheme,t
}=useApp(),navigate=useNavigate(),[notice,setNotice]=useState('');
const profile=JSON.parse(localStorage.getItem('SkillBridge-demo-profile')||'null');
const action=(message)=>setNotice(message);
function logout(){
localStorage.removeItem('SkillBridge-demo-session');
navigate('/login')
}return <>
<div className="page-title">
<p>{
t('pages.account')
}</p>
<h1>{
t('pages.profile')
}</h1>
</div>
<section className="account-card">
<UserRound/>
<div>
<h2>{
profile?.name||t('pages.account')
}</h2>
<p>{
profile?.email||'Your name, contact details and saved locations will appear here after the account integration is connected.'
}</p>
</div>
</section>{
notice&&<p className="settings-notice">{
notice
}</p>
}<section className="settings-grid">
<article>
<MapPinned/>
<div>
<h2>{
t('pages.savedLocations')
}</h2>
<p>Add and manage home, work, and other service addresses.</p>
</div>
<button type="button" onClick={
()=>action('Saved locations will be available when your customer account is connected.')
}>{
t('pages.manage')
}</button>
</article>
<article>
<Palette/>
<div>
<h2>{
t('pages.appearance')
}</h2>
<p>{
theme==='dark'?'Dark':'Light'
} mode · {
language==='en'?'English':language==='hi'?'हिंदी':'ਪੰਜਾਬੀ'
}</p>
</div>
<button type="button" onClick={
()=>setTheme(theme==='dark'?'light':'dark')
}>{
t('pages.toggleTheme')
}</button>
</article>
<article>
<ShieldCheck/>
<div>
<h2>{
t('pages.privacy')
}</h2>
<p>Control account access and data preferences.</p>
</div>
<button type="button" onClick={
()=>action('Privacy controls will be connected to your account settings.')
}>{
t('pages.view')
}</button>
</article>
<article>
<CircleHelp/>
<div>
<h2>{
t('pages.help')
}</h2>
<p>Find answers or get support with a booking.</p>
</div>
<button type="button" onClick={
()=>action('Support options will appear here when the service desk is connected.')
}>{
t('pages.getHelp')
}</button>
</article>
</section>
<div className="profile-links">
<Link to="/customer/bookings">{
t('pages.bookingHistory')
}</Link>
<button onClick={
logout
}>
<LogOut size={
17
}/> {
t('pages.logout')
}</button>
</div>
</>
}

import {
 NavLink 
} from 'react-router-dom';
 import {
 Bell, BriefcaseBusiness, House, Search, UserRound 
} from 'lucide-react';
 import ThemeToggle from '../ThemeToggle/ThemeToggle';
 import LanguageSelector from '../LanguageSelector/LanguageSelector';
 import {
 useApp 
} from '../../context/AppContext';
 import './Shell.css';

export default function Shell({
children
}) {
 const {
t
}=useApp();
 const links=[['/customer',House,'home'],['/customer/search',Search,'search'],['/customer/bookings',BriefcaseBusiness,'bookings'],['/customer/notifications',Bell,'notifications'],['/customer/profile',UserRound,'profile']];
 const navigation=<>{
links.map(([to,Icon,label])=>
<NavLink key={
to
} end={
to==='/customer'
} to={
to
}>
<Icon size={
20
}/>
<span>{
t(`nav.${
label
}`)
}</span>
</NavLink>)
}</>;
 return <div className="app-shell">
<header className="topbar">
<NavLink to="/customer" className="brand">Skill<span>Build</span>
</NavLink>
<div className="header-tools">
<LanguageSelector/>
<ThemeToggle/>
</div>
</header>
<div className="customer-layout">
<aside className="side-nav">
<p>Customer menu</p>{
navigation
}</aside>
<main className="page-wrap">{
children
}</main>
</div>
<nav className="bottom-nav">{
navigation
}</nav>
</div> 
}

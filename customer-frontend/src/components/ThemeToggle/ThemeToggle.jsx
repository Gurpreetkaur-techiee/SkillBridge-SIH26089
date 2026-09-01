import {
 Moon, Sun 
} from 'lucide-react';
 import {
useApp
} from '../../context/AppContext';
 import './ThemeToggle.css';

export default function ThemeToggle(){
const{
theme,setTheme
}=useApp();
const dark=theme==='dark';
return <button className="theme-toggle" onClick={
()=>setTheme(dark?'light':'dark')
} aria-label={
`Switch to ${
dark?'light':'dark'
} mode`
}>{
dark?<Sun size={
17
}/>:<Moon size={
17
}/>
}<span>{
dark?'Light':'Dark'
}</span>
</button>
}

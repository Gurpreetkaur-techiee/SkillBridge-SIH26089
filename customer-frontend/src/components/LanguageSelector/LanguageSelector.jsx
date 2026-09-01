import {
useApp
} from '../../context/AppContext';
 import './LanguageSelector.css';

export default function LanguageSelector(){
const{
language,setLanguage
}=useApp();
return <select aria-label="Language" className="language-select" value={
language
} onChange={
e=>setLanguage(e.target.value)
}>
<option value="en">English</option>
<option value="hi">हिंदी</option>
<option value="pa">ਪੰਜਾਬੀ</option>
</select>
}

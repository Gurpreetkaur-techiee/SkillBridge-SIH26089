import {
 createContext, useContext, useEffect, useState 
} from 'react';

import en from '../translations/en';
 import hi from '../translations/hi';
 import pa from '../translations/pa';

const dictionaries = {
 en, hi, pa 
};
 const AppContext = createContext();

export function AppProvider({
 children 
}) {
 const [theme,setTheme]=useState(()=>localStorage.getItem('SkillBridge-theme')||'light');
 const [language,setLanguage]=useState(()=>localStorage.getItem('SkillBridge-language')||'en');

 useEffect(()=>{
document.documentElement.dataset.theme=theme;
localStorage.setItem('SkillBridge-theme',theme)
},[theme]);
 useEffect(()=>localStorage.setItem('SkillBridge-language',language),[language]);

 const t=(key)=>key.split('.').reduce((o,k)=>o?.[k],dictionaries[language])||dictionaries.en[key.split('.').at(-1)]||key;

 return <AppContext.Provider value={
{
theme,setTheme,language,setLanguage,t
}
}>{
children
}</AppContext.Provider> 
}
export const useApp=()=>useContext(AppContext);


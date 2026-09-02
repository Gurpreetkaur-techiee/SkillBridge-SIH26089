import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const supportedLanguages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('skillbridge_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('skillbridge_lang', lang);
  }, [lang]);

  const t = (key) => {
    const currentDict = translations[lang] || translations.en;
    return currentDict[key] || translations.en[key] || key;
  };

  const currentLanguageMeta = supportedLanguages.find(l => l.code === lang) || supportedLanguages[0];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, supportedLanguages, currentLanguageMeta }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

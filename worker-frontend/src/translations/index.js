import { en } from './en.js';
import { hi } from './hi.js';
import { pa } from './pa.js';

export const translations = {
  en,
  hi,
  pa,
};

export const availableLanguages = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export function getTranslation(lang, keyPath, params = {}) {
  const currentDict = translations[lang] || translations.en;
  const fallbackDict = translations.en;

  const resolve = (dict, path) => {
    const keys = path.split('.');
    let result = dict;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return null;
      }
    }
    return typeof result === 'string' ? result : null;
  };

  let text = resolve(currentDict, keyPath) || resolve(fallbackDict, keyPath) || keyPath;

  // Interpolate params e.g. {count}, {hours}
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((paramKey) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
    });
  }

  return text;
}

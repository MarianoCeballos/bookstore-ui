import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { STORAGE_KEYS } from '@/constants';
import en from '@/i18n/en.json';
import es from '@/i18n/es.json';

function getInitialLanguage(): 'en' | 'es' {
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (saved === 'en' || saved === 'es') {
        return saved;
      }
    } catch {
      // Ignore storage errors in restricted environments
    }
  }
  return 'en';
}

void i18n.use(initReactI18next).init({
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
});

export default i18n;

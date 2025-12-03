import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import frTranslation from '../locales/fr.json';
import enTranslation from '../locales/en.json';
import arTranslation from '../locales/ar.json';

const resources = {
  fr: {
    translation: frTranslation
  },
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr', // Default language
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Language-specific configurations
    lng: 'fr',
    
    // RTL support for Arabic
    supportedLngs: ['fr', 'en', 'ar'],
    
    // Special handling for RTL languages
    
    react: {
      useSuspense: false,
    }
  });

// Set document direction based on language
i18n.on('languageChanged', (lng) => {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('lang', lng);
  
  if (lng === 'ar') {
    htmlElement.setAttribute('dir', 'rtl');
    htmlElement.classList.add('rtl');
  } else {
    htmlElement.setAttribute('dir', 'ltr');
    htmlElement.classList.remove('rtl');
  }
});

export default i18n;

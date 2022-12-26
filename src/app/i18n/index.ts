import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from './translations/fr.json';
import en from './translations/en.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'fr',
  resources: {
    fr,
    en,
  },
});

const setApplicationLanguage = (lang: 'fr' | 'en') => {
  if (!['en', 'fr'].includes(lang)) {
    return;
  }

  i18n.changeLanguage(lang);
};

export { setApplicationLanguage };
export default i18n;

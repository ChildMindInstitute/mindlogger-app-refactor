import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from '@assets/translations/fr.json';
import en from '@assets/translations/en.json';

const initializeLocalization = () =>
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en,
      fr,
    },
  });

const setApplicationLanguage = (lang: 'fr' | 'en') => {
  if (!['en', 'fr'].includes(lang)) {
    return;
  }

  i18n.changeLanguage(lang);
};

initializeLocalization();

export { setApplicationLanguage, initializeLocalization };
export default i18n;

import en from '@assets/translations/en.json';
import fr from '@assets/translations/fr.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

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

z.setErrorMap(zodI18nMap);

// @todo - automatically detect language of the device

export { initializeLocalization };
export default i18n;

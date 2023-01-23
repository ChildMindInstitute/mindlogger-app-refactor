import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

import en from '@assets/translations/en.json';
import fr from '@assets/translations/fr.json';
import { createJob } from '@shared/lib';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

z.setErrorMap(zodI18nMap);

export default createJob(() => {
  return i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en,
      fr,
    },
    returnNull: false,
  });

  // @todo - automatically detect language of the device
});

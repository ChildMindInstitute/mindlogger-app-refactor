import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

import el from '@assets/translations/el.json';
import en from '@assets/translations/en.json';
import es from '@assets/translations/es.json';
import fr from '@assets/translations/fr.json';

import { getDefaultLocalizationStorage } from './localizationStorageInstance';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

z.setErrorMap(zodI18nMap);

export function setupLocalization() {
  const language = getDefaultLocalizationStorage().getLanguage() ?? 'en';

  return i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: language,
    fallbackLng: 'en',
    resources: {
      en,
      fr,
      el,
      es,
    },
    returnNull: false,
  });

  // @todo - automatically detect language of the device
}

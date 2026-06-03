import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import af from '@assets/translations/af.json';
import el from '@assets/translations/el.json';
import en from '@assets/translations/en.json';
import es from '@assets/translations/es.json';
import fr from '@assets/translations/fr.json';
import ptBr from '@assets/translations/pt.json';
import xh from '@assets/translations/xh.json';
import zu from '@assets/translations/zu.json';

import { getDefaultLocalizationStorage } from './localizationStorageInstance';
import { validateTranslations } from './validateTranslations';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

z.setErrorMap(zodI18nMap);

const resources = {
  en,
  fr,
  el,
  es,
  pt: ptBr,
  af,
  xh,
  zu,
};

const REFERENCE_LANGUAGE = 'en';

// Surface malformed list values in Datadog so a bad translation file is caught even after release.
function reportMalformedTranslations() {
  const malformed = validateTranslations(resources, REFERENCE_LANGUAGE).filter(
    finding => finding.type === 'malformed-list',
  );

  malformed.forEach(finding => {
    getDefaultLogger().warn('[i18n] Malformed translation list', finding);
  });
}

export function setupLocalization() {
  const language = getDefaultLocalizationStorage().getLanguage() ?? 'en';

  reportMalformedTranslations();

  return i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: language,
    fallbackLng: 'en',
    resources,
    returnNull: false,
  });

  // @todo - automatically detect language of the device
}

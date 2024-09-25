import { MMKV } from 'react-native-mmkv';

import { Language } from '@app/shared/lib/types/language';

import { ILocalizationStorage } from './ILocalizationStorage';

export function LocalizationStorage(
  localizationStorage: MMKV,
): ILocalizationStorage {
  return {
    setLanguage(language: Language) {
      localizationStorage.set('language', language);
    },
    getLanguage(): Language | undefined {
      return localizationStorage.getString('language') as Language;
    },
  };
}

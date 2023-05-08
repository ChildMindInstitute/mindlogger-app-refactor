import { Language, createStorage } from '@app/shared/lib';

function LocalizationStorage() {
  const storage = createStorage('localization');

  return {
    setLanguage(language: Language) {
      storage.set('language', language);
    },
    getLanguage(): Language | undefined {
      return storage.getString('language') as Language;
    },
  };
}

export default LocalizationStorage();

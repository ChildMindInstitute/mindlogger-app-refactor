import { Language } from '@app/shared/lib/types/language';

export type ILocalizationStorage = {
  setLanguage: (language: Language) => void;
  getLanguage: () => Language | undefined;
};

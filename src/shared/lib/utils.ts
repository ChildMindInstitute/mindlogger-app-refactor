import i18n from 'i18next';

import { Language } from './types';

export const noop = () => {};

export const changeLanguage = (locale: Language) => {
  return i18n.changeLanguage(locale);
};

import i18n from 'i18next';

import { Language } from './types';

export const noop = () => {};

export const changeLanguage = (locale: Language) => {
  return i18n.changeLanguage(locale);
};

export function wait(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export const shuffle = <T>(array: Array<T>) => {
  return array.sort(() => 0.5 - Math.random());
};

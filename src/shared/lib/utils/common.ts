import i18n from 'i18next';

import { type Language } from '../types';

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

export function range(n: number): number[] {
  return [...Array(n).keys()];
}

export function randomString(length: number) {
  const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const dictLen = dict.length;
  let counter = 0;

  while (counter < length) {
    result += dict.charAt(Math.floor(Math.random() * dictLen));
    counter++;
  }
  return result;
}

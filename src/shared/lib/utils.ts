import { format as formatBase } from 'date-fns';
import { enGB, fr } from 'date-fns/locale';
import i18n from 'i18next';

import { type Language } from './types';

const dateFnsLocales = { fr, en: enGB };

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

export const format = (date: Date | number, formatStr: string) => {
  return formatBase(date, formatStr, {
    locale: dateFnsLocales[i18n.language as Language],
  });
};

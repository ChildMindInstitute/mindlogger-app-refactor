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

export const isEmptyObject = (object: any) => {
  return Object.keys(object).length;
};

export function getCurrentWeekDates(): Array<Date> {
  return Array.from(Array(7).keys()).map(idx => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + (idx + 1));

    return date;
  });
}

export function splitArray<TListItem>(
  array: TListItem[],
  leftArraySize: number,
): [TListItem[], TListItem[]] {
  const rightArray = [...array];

  const leftArray = rightArray.splice(0, leftArraySize);

  return [leftArray, rightArray];
}

export const Mutex = () => {
  let busy = false;

  return {
    setBusy: function () {
      busy = true;
    },
    release: function () {
      busy = false;
    },
    isBusy: function () {
      return busy;
    },
  };
};

export const getTwoDigits = (val: number) => {
  return val.toString().padStart(2, '0');
};

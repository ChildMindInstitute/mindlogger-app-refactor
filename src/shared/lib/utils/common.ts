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
  return !!Object.keys(object).length;
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

export const getFloatPartLength = (numberValue: number) => {
  const numberAsString = numberValue.toString();

  const pointPosition = Math.max(
    numberAsString.indexOf('.'),
    numberAsString.indexOf(','),
  );
  return pointPosition === -1 ? 0 : numberAsString.length - pointPosition - 1;
};

export interface IMutex {
  setBusy: () => void;
  release: () => void;
  isBusy: () => boolean;
}

export const Mutex = (): IMutex => {
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

export const callWithMutexAsync = async (
  mutex: IMutex,
  func: () => Promise<any>,
) => {
  if (mutex.isBusy()) {
    return;
  }
  try {
    mutex.setBusy();
    await func();
  } finally {
    mutex.release();
  }
};

export const callWithMutex = (mutex: IMutex, func: () => void) => {
  if (mutex.isBusy()) {
    return;
  }
  try {
    mutex.setBusy();
    func();
  } finally {
    mutex.release();
  }
};

export const getTwoDigits = (val: number) => {
  return val.toString().padStart(2, '0');
};

export const getStringHashCode = (inputString: string) => {
  if (!inputString) {
    throw new Error('[getStringHashCode] inputString is not defined');
  }
  let result = 0;
  for (let i = 0; i < inputString.length; i++) {
    result = Math.imul(31, result) + inputString.charCodeAt(i);
  }
  return Math.abs(result);
};

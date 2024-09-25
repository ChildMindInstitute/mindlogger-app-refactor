import { Dimensions, Platform } from 'react-native';

import i18n from 'i18next';

import { IS_ANDROID, IS_IOS } from '../constants';
import { Language } from '../types/language';

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

export const isObjectNotEmpty = (object: object) => {
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

export function chunkArray<TItem>(
  array: Array<TItem>,
  size: number,
): Array<Array<TItem>> {
  if (array.length === 0) {
    return [];
  }

  return array.reduce<Array<Array<TItem>>>((acc, val) => {
    if (acc.length === 0) {
      acc.push([]);
    }

    const lastArray = acc[acc.length - 1];

    if (lastArray.length < size) {
      lastArray.push(val);
    } else {
      acc.push([val]);
    }

    return acc;
  }, []);
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

export const runOnIOS = (cb: () => void) => {
  IS_IOS && cb();
};

export const runOnAndroid = (cb: () => void) => {
  IS_ANDROID && cb();
};

export const splitArrayToBulks = <T>(
  bulkSize: number,
  array: T[],
): Array<T[]> => {
  const result: Array<T[]> = [];
  for (let i = 0; i < array.length; i += bulkSize) {
    result.push(array.slice(i, i + bulkSize));
  }
  return result;
};

/**
 * The helper function helps determine if the current device
 * is iPhone X series (X, XR, Xs).
 * @author https://github.com/ptelad/react-native-iphone-x-helper
 * @license MIT
 */
export function isIphoneX(): boolean {
  const dimensions = Dimensions.get('window');

  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (dimensions.height === 780 ||
      dimensions.width === 780 ||
      dimensions.height === 812 ||
      dimensions.width === 812 ||
      dimensions.height === 844 ||
      dimensions.width === 844 ||
      dimensions.height === 896 ||
      dimensions.width === 896 ||
      dimensions.height === 926 ||
      dimensions.width === 926)
  );
}

export const filterDuplicates = <TItem>(array: Array<TItem>): Array<TItem> =>
  Array.from(new Set(array));

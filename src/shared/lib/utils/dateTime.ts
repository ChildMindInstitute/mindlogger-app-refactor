import {
  format as formatBase,
  isEqual,
  subDays,
  getUnixTime,
  subMonths,
} from 'date-fns';
import { enGB, fr } from 'date-fns/locale';
import i18n from 'i18next';

import { range } from './common';
import { MINUTES_IN_HOUR, MS_IN_MINUTE, MS_IN_SECOND } from '../constants';
import { HourMinute, DayMonthYear, type Language } from '../types';

const dateFnsLocales = { fr, en: enGB };

export const getMsFromHours = (hours: number): number => {
  return hours * (MINUTES_IN_HOUR * MS_IN_MINUTE);
};

export const getMsFromMinutes = (minutes: number): number => {
  return minutes * MS_IN_MINUTE;
};

export const getMsFromSeconds = (seconds: number): number => {
  return seconds * MS_IN_SECOND;
};

export const format = (date: Date | number, formatStr: string) => {
  // todo - it doesn't work, tried  H or HH
  return formatBase(date, formatStr, {
    locale: dateFnsLocales[i18n.language as Language],
  });
};

export const formatToDtoDate = (date: Date | number) => {
  return formatBase(date, 'yyyy-MM-dd');
};

export const formatToDtoTime = (date: Date | number, addSeconds = false) => {
  return formatBase(date, addSeconds ? 'HH:mm:ss' : 'HH:mm');
};

type TimeOrNoun = {
  formattedDate?: string | null;
  translationKey?: string | null;
};

export const convertToTimeOnNoun = (date: Date): TimeOrNoun => {
  if (date.getHours() === 12 && date.getMinutes() === 0) {
    return { translationKey: 'applet_list_component:noon' };
  } else if (
    (date.getHours() === 23 && date.getMinutes() === 59) ||
    (date.getHours() === 0 && date.getMinutes() === 0)
  ) {
    return { translationKey: 'applet_list_component:midnight' };
  } else {
    return {
      formattedDate: date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  }
};

export const getDiff = (from: HourMinute, to: HourMinute): number => {
  return (
    getMsFromHours(to.hours) +
    getMsFromMinutes(to.minutes) -
    (getMsFromHours(from.hours) + getMsFromMinutes(from.minutes))
  );
};

export const isSourceLess = (
  timeSource: HourMinute,
  timeTarget: HourMinute,
) => {
  const sourceInMinutes =
    timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes;
  const targetInMinutes =
    timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes;
  return sourceInMinutes < targetInMinutes;
};

export const isSourceBiggerOrEqual = (
  timeSource: HourMinute,
  timeTarget: HourMinute,
) => {
  const sourceInMinutes =
    timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes;
  const targetInMinutes =
    timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes;
  return sourceInMinutes >= targetInMinutes;
};

export const isTimeInInterval = (
  timeToCheck: HourMinute,
  intervalFrom: HourMinute,
  intervalTo: HourMinute,
) => {
  return (
    isSourceBiggerOrEqual(timeToCheck, intervalFrom) &&
    isSourceLess(timeToCheck, intervalTo)
  );
};

export function getLast7Dates() {
  const now = new Date();

  return range(7)
    .map(i => subDays(now, i))
    .reverse();
}

export const buildDateFromDto = (
  dto: string | null | undefined,
): Date | null => {
  if (!dto) {
    return null;
  }
  const result = new Date(`${dto}T00:00`);

  if (result.getFullYear() === 1 || result.getFullYear() === 9999) {
    return null;
  }

  return result;
};

export const areDatesEqual = (dateLeft: Date, dateRight: Date): boolean =>
  isEqual(dateLeft.setHours(0, 0, 0, 0), dateRight.setHours(0, 0, 0, 0));

export const getUnixTimestamp = (date: Date | number): number =>
  getUnixTime(date);

export const getMidnightDateInMs = (date: Date = new Date()): number =>
  date.setHours(0, 0, 0, 0);

export const convertToDayMonthYear = (date: Date): DayMonthYear => ({
  day: date.getDate(),
  month: date.getMonth() + 1,
  year: date.getFullYear(),
});

export const getMonthAgoDate = () => formatToDtoDate(subMonths(new Date(), 1));

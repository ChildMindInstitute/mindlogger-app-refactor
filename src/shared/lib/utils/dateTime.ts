import {
  format as formatBase,
  isEqual,
  subDays,
  getUnixTime,
  subMonths,
} from 'date-fns';
import { enGB, fr } from 'date-fns/locale';
import i18n from 'i18next';

import { getTwoDigits, range } from './common';
import {
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
  MS_IN_SECOND,
} from '../constants/dateTime';
import { DayMonthYear, HourMinute } from '../types/dateTime';
import { Language } from '../types/language';

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

export const getHourMinute = (dateTime: Date): HourMinute => {
  return {
    hours: dateTime.getHours(),
    minutes: dateTime.getMinutes(),
  };
};

export const format = (date: Date | number, formatStr: string) => {
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

export const formatToISODateMidnight = (date: Date | number) =>
  formatBase(date, "yyyy-MM-dd'T'00:00:00");

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

type TimeCompareInput = {
  timeSource: HourMinute;
  timeTarget: HourMinute;
};

export const isSourceLess = ({ timeSource, timeTarget }: TimeCompareInput) => {
  const sourceInMinutes =
    timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes;
  const targetInMinutes =
    timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes;
  return sourceInMinutes < targetInMinutes;
};

export const isSourceLessOrEqual = ({
  timeSource,
  timeTarget,
}: TimeCompareInput) => {
  const sourceInMinutes =
    timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes;
  const targetInMinutes =
    timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes;
  return sourceInMinutes <= targetInMinutes;
};

export const isSourceBiggerOrEqual = ({
  timeSource,
  timeTarget,
}: TimeCompareInput) => {
  const sourceInMinutes =
    timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes;
  const targetInMinutes =
    timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes;
  return sourceInMinutes >= targetInMinutes;
};

export const isSourceBigger = ({
  timeSource,
  timeTarget,
}: TimeCompareInput) => {
  const sourceInMinutes =
    timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes;
  const targetInMinutes =
    timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes;
  return sourceInMinutes > targetInMinutes;
};

type InIntervalCheckInput = {
  timeToCheck: HourMinute;
  intervalFrom: HourMinute;
  intervalTo: HourMinute;
  including: 'from' | 'to' | 'both' | 'none';
};

export const isTimeInInterval = ({
  timeToCheck,
  intervalFrom,
  intervalTo,
  including,
}: InIntervalCheckInput) => {
  if (including === 'from') {
    return (
      isSourceBiggerOrEqual({
        timeSource: timeToCheck,
        timeTarget: intervalFrom,
      }) && isSourceLess({ timeSource: timeToCheck, timeTarget: intervalTo })
    );
  } else if (including === 'none') {
    return (
      isSourceBigger({ timeSource: timeToCheck, timeTarget: intervalFrom }) &&
      isSourceLess({ timeSource: timeToCheck, timeTarget: intervalTo })
    );
  } else {
    throw new Error(
      '[isTimeInInterval]: Not supported, including = ' + including,
    );
  }
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

export const getMidnightDateInMs = (date: Date = getNow()): number =>
  date.setHours(0, 0, 0, 0);

export const convertToDayMonthYear = (date: Date): DayMonthYear => ({
  day: date.getDate(),
  month: date.getMonth() + 1,
  year: date.getFullYear(),
});

export const getMonthAgoDate = () => formatToDtoDate(subMonths(new Date(), 1));

export const buildDateTimeFromDto = (yyyymmdd: string, hhmmss: string) =>
  new Date(`${yyyymmdd} ${hhmmss}`);

export const getDateFromString = (dateString: string) => {
  // converts yyyy-mm-dd string to Date , ignoring timeZone
  const [year, month, day] = dateString.split('-');

  if (!year || !month || !day) {
    throw new Error('[getDateFromString] dateString format is not valid');
  }

  return new Date(Number(year), Number(month) - 1, Number(day));
};

/**
 *
 * @returns The difference, in minutes, between date as evaluated in the UTC time zone
 * but with the opposite sign which is expected by the Backend server.
 */
export const getTimezoneOffset = () => new Date().getTimezoneOffset() * -1;

export const getNow = () => new Date();

export function getClockTime(date: number): string {
  if (!date) {
    return '';
  }

  const hours = Math.floor(date / MS_IN_MINUTE / MINUTES_IN_HOUR);
  const minutes = Math.floor((date - getMsFromHours(hours)) / MS_IN_MINUTE);
  const seconds = Math.round(
    (date - getMsFromHours(hours) - getMsFromMinutes(minutes)) / MS_IN_SECOND,
  );

  if (hours >= 1) {
    return `${getTwoDigits(hours)}h ${getTwoDigits(minutes)}m`;
  } else {
    return `${getTwoDigits(minutes)}:${getTwoDigits(seconds)}`;
  }
}

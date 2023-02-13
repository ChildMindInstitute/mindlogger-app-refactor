import { format as formatBase } from 'date-fns';
import { enGB, fr } from 'date-fns/locale';
import i18n from 'i18next';

import { MINUTES_IN_HOUR, MS_IN_MINUTE } from '../constants';
import { HourMinute, type Language } from '../types';

const dateFnsLocales = { fr, en: enGB };

export const getMsFromHours = (hours: number): number => {
  return hours * (MINUTES_IN_HOUR * MS_IN_MINUTE);
};

export const getMsFromMinutes = (minutes: number): number => {
  return minutes * MS_IN_MINUTE;
};

export const format = (date: Date | number, formatStr: string) => {
  return formatBase(date, formatStr, {
    locale: dateFnsLocales[i18n.language as Language],
  });
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

export const isSourceTimeBigger = (
  timeSource: HourMinute,
  timeTarget: HourMinute,
) => {
  const minutesElapsedFromStartOfDayForSource =
    timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes;
  const minutesElapsedFromStartOfDayForTarget =
    timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes;
  return (
    minutesElapsedFromStartOfDayForSource >
    minutesElapsedFromStartOfDayForTarget
  );
};

export const isTimeInInterval = (
  timeToCheck: HourMinute,
  intervalFrom: HourMinute,
  intervalTo: HourMinute,
) => {
  return (
    isSourceTimeBigger(timeToCheck, intervalFrom) &&
    !isSourceTimeBigger(timeToCheck, intervalTo)
  );
};

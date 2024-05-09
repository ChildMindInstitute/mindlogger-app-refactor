import { getTimeZone } from 'react-native-localize';

export const MS_IN_MINUTE = 60000;
export const MS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
export const MINUTES_IN_HOUR = 60;

const date = new Date();
date.setHours(0);
date.setMinutes(0);
date.setSeconds(0);
export const MIDNIGHT_DATE = date;

export const TIMEZONE = getTimeZone();

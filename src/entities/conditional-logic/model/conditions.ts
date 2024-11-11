import { isAfter, isBefore, isEqual, parseISO } from 'date-fns';

import { timeToMinutes } from '@app/entities/activity/lib/services/timeToMinutes';
import { HourMinute } from '@app/shared/lib/types/dateTime';

export const isBetweenValues = (
  input: Maybe<number>,
  min: number,
  max: number,
) => {
  if (input == null) {
    return false;
  }

  return input > min && input < max;
};

export const isOutsideOfValues = (
  input: Maybe<number>,
  min: number,
  max: number,
) => {
  if (input == null) {
    return false;
  }

  return input < min || input > max;
};

export const isEqualToValue = (
  input: unknown,
  valueToCompareWith: NonNullable<unknown>,
) => {
  if (input == null) {
    return false;
  }

  return input === valueToCompareWith;
};

export const isGreaterThan = (
  input: Maybe<number>,
  valueToCompareWith: number,
) => {
  if (input == null) {
    return false;
  }

  return input > valueToCompareWith;
};

export const isLessThan = (
  input: Maybe<number>,
  valueToCompareWith: number,
) => {
  if (input == null) {
    return false;
  }

  return input < valueToCompareWith;
};

export const includesValue = <TItem>(input: Maybe<TItem[]>, value: TItem) => {
  if (input == null) {
    return false;
  }

  return input.includes(value);
};

export const doesNotIncludeValue = <TItem>(
  input: Maybe<TItem[]>,
  value: TItem,
) => {
  if (input == null) {
    return false;
  }

  return !input.includes(value);
};

export const isGreaterThanDate = (input: string, date: string) => {
  return input ? isAfter(parseISO(input), parseISO(date)) : false;
};

export const isLessThanDate = (input: string, date: string) => {
  return input ? isBefore(parseISO(input), parseISO(date)) : false;
};

export const isEqualToDate = (input: Maybe<string>, date: string) => {
  if (!input) return false;
  return input ? isEqual(parseISO(input), parseISO(date)) : false;
};

export const isBetweenDates = (
  input: Maybe<string>,
  minDate: string,
  maxDate: string,
) => {
  return input
    ? !isBefore(parseISO(input), parseISO(minDate)) &&
        !isAfter(parseISO(input), parseISO(maxDate))
    : false;
};

export const isNotEqualToDate = (input: Maybe<string>, date: string) => {
  return input ? !isEqual(parseISO(input), parseISO(date)) : false;
};

export const isOutsideOfDates = (
  input: Maybe<string>,
  minDate: string,
  maxDate: string,
) => {
  return input
    ? isBefore(parseISO(input), parseISO(minDate)) ||
        isAfter(parseISO(input), parseISO(maxDate))
    : false;
};

const getTimeBasedOnFieldName = (
  fieldName: string,
  timeRange: { startTime: HourMinute | null; endTime: HourMinute | null },
): HourMinute | null => {
  return fieldName === 'from' ? timeRange.startTime : timeRange.endTime;
};

export const isGreaterThanTimeRange = (
  timeRange: { startTime: HourMinute | null; endTime: HourMinute | null },
  { time, fieldName }: { time: HourMinute; fieldName: string },
): boolean => {
  const selectedTime = getTimeBasedOnFieldName(fieldName, timeRange);
  return selectedTime
    ? timeToMinutes(selectedTime) > timeToMinutes(time)
    : false;
};

export const isLessThanTimeRange = (
  timeRange: { startTime: HourMinute | null; endTime: HourMinute | null },
  { time, fieldName }: { time: HourMinute; fieldName: string },
): boolean => {
  const selectedTime = getTimeBasedOnFieldName(fieldName, timeRange);
  return selectedTime
    ? timeToMinutes(selectedTime) < timeToMinutes(time)
    : false;
};

export const isEqualToTimeRange = (
  timeRange: { startTime: HourMinute | null; endTime: HourMinute | null },
  { time, fieldName }: { time: HourMinute; fieldName: string },
): boolean => {
  const selectedTime = getTimeBasedOnFieldName(fieldName, timeRange);
  return selectedTime
    ? timeToMinutes(selectedTime) == timeToMinutes(time)
    : false;
};

export const isNotEqualToTimeRange = (
  timeRange: { startTime: HourMinute | null; endTime: HourMinute | null },
  { time, fieldName }: { time: HourMinute; fieldName: string },
): boolean => {
  const selectedTime = getTimeBasedOnFieldName(fieldName, timeRange);
  return selectedTime
    ? timeToMinutes(selectedTime) !== timeToMinutes(time)
    : false;
};

export const isBetweenTimesRange = (
  timeRange: { startTime: HourMinute | null; endTime: HourMinute | null },
  {
    minTime,
    maxTime,
    fieldName,
  }: { minTime: HourMinute; maxTime: HourMinute; fieldName: string },
): boolean => {
  const selectedTime = getTimeBasedOnFieldName(fieldName, timeRange);
  const selectedTimeInMinutes = selectedTime
    ? timeToMinutes(selectedTime)
    : null;

  return (
    selectedTimeInMinutes !== null &&
    selectedTimeInMinutes >= timeToMinutes(minTime) &&
    selectedTimeInMinutes <= timeToMinutes(maxTime)
  );
};

export const isOutsideOfTimesRange = (
  timeRange: { startTime: HourMinute | null; endTime: HourMinute | null },
  {
    minTime,
    maxTime,
    fieldName,
  }: { minTime: HourMinute; maxTime: HourMinute; fieldName: string },
): boolean => {
  const selectedTime = getTimeBasedOnFieldName(fieldName, timeRange);
  const selectedTimeInMinutes = selectedTime
    ? timeToMinutes(selectedTime)
    : null;

  return (
    selectedTimeInMinutes !== null &&
    (selectedTimeInMinutes < timeToMinutes(minTime) ||
      selectedTimeInMinutes > timeToMinutes(maxTime))
  );
};

export const isGreaterThanTime = (
  input: { hours: number; minutes: number },
  time: { hours: number; minutes: number },
): boolean => {
  const inputMinutes = timeToMinutes(input);
  const conditionMinutes = timeToMinutes(time);

  const result = inputMinutes > conditionMinutes;

  return result;
};

export const isLessThanTime = (
  input: { hours: number; minutes: number },
  time: { hours: number; minutes: number },
) => {
  const inputMinutes = timeToMinutes(input);
  const conditionMinutes = timeToMinutes(time);

  const result = inputMinutes < conditionMinutes;

  return result;
};

export const isEqualToTime = (
  input: { hours: number; minutes: number },
  time: { hours: number; minutes: number },
) => {
  const inputMinutes = timeToMinutes(input);
  const conditionMinutes = timeToMinutes(time);

  const result = inputMinutes == conditionMinutes;

  return result;
};

export const isNotEqualToTime = (
  input: { hours: number; minutes: number },
  time: { hours: number; minutes: number },
) => {
  const inputMinutes = timeToMinutes(input);
  const conditionMinutes = timeToMinutes(time);

  const result = inputMinutes !== conditionMinutes;

  return result;
};

export const isBetweenTimes = (
  input: Maybe<{ hours: number; minutes: number }>,
  minTime: { hours: number; minutes: number },
  maxTime: { hours: number; minutes: number },
) => {
  if (!input) return false;
  return isGreaterThanTime(input, minTime) && isLessThanTime(input, maxTime);
};

export const isOutsideOfTimes = (
  input: Maybe<{ hours: number; minutes: number }>,
  minTime: { hours: number; minutes: number },
  maxTime: { hours: number; minutes: number },
) => {
  if (!input) return false;
  return isLessThanTime(input, minTime) || isGreaterThanTime(input, maxTime);
};

export const isOutsideOfSliderRowValues = (
  rowValue: number,
  minValue: number,
  maxValue: number,
) => {
  return rowValue !== null && (rowValue < minValue || rowValue > maxValue);
};

export const isBetweenSliderRowValues = (
  rowValue: number,
  minValue: number,
  maxValue: number,
) => {
  return rowValue !== null && rowValue >= minValue && rowValue <= maxValue;
};

export const isLessThanSliderRow = (rowValue: number, value: number) => {
  return rowValue !== null && rowValue < value;
};

export const isGreaterThanSliderRow = (rowValue: number, value: number) => {
  return rowValue !== null && rowValue > value;
};
export const isNotEqualToSliderRow = (rowValue: number, value: number) => {
  return rowValue !== null && rowValue !== value;
};

export const isEqualToSliderRow = (rowValue: number, value: number) => {
  return rowValue !== null && rowValue === value;
};

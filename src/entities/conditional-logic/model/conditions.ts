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

function isValidTimeFormat(
  time: { hours: number; minutes: number } | null | undefined,
): boolean {
  return (
    !!time && typeof time.hours === 'number' && typeof time.minutes === 'number'
  );
}
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
  return input.toString() === valueToCompareWith.toString();
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

export const isGreaterThanDate = (input: Maybe<string>, date: string) => {
  if (!input) return false;
  return isAfter(parseISO(input), parseISO(date));
};
export const isLessThanDate = (input: Maybe<string>, date: string) => {
  if (!input) return false;
  return isBefore(parseISO(input), parseISO(date));
};

export const isEqualToDate = (input: Maybe<string>, date: string) => {
  if (!input) return false;
  return isEqual(parseISO(input), parseISO(date));
};

export const isBetweenDates = (
  input: Maybe<string>,
  minDate: string,
  maxDate: string,
) => {
  if (!input) return false;
  return input
    ? !isBefore(parseISO(input), parseISO(minDate)) &&
        !isAfter(parseISO(input), parseISO(maxDate))
    : false;
};

export const isNotEqualToDate = (input: Maybe<string>, date: string) => {
  if (!input) return false;
  return !isEqual(parseISO(input), parseISO(date));
};

export const isOutsideOfDates = (
  input: Maybe<string>,
  minDate: string,
  maxDate: string,
) => {
  if (!input) return false;
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
const parseTimeString = (time: string): HourMinute => {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
};
export const isGreaterThanTimeRange = (
  timeRange: Maybe<{
    startTime: HourMinute | null;
    endTime: HourMinute | null;
  }>,
  { time, fieldName }: { time: HourMinute; fieldName: string },
): boolean => {
  if (!time || !timeRange) return false;

  const selectedTime = getTimeBasedOnFieldName(fieldName, timeRange);

  if (!isValidTimeFormat(selectedTime)) return false;

  const normalizedTime =
    typeof time === 'string' ? parseTimeString(time) : time;

  return selectedTime
    ? timeToMinutes(selectedTime) > timeToMinutes(normalizedTime)
    : false;
};

export const isLessThanTimeRange = (
  timeRange: Maybe<{
    startTime: HourMinute | null;
    endTime: HourMinute | null;
  }>,
  { time, fieldName }: { time: HourMinute; fieldName: string },
): boolean => {
  if (!time || !timeRange) return false;

  const selectedTime = getTimeBasedOnFieldName(fieldName, timeRange);

  if (!isValidTimeFormat(selectedTime)) return false;

  const normalizedTime =
    typeof time === 'string' ? parseTimeString(time) : time;

  return selectedTime
    ? timeToMinutes(selectedTime) < timeToMinutes(normalizedTime)
    : false;
};

export const isEqualToTimeRange = (
  timeRange: Maybe<{
    startTime: HourMinute | null;
    endTime: HourMinute | null;
  }>,
  { time, fieldName }: { time: HourMinute; fieldName: string },
): boolean => {
  if (!time || !timeRange) return false;

  const selectedTime = getTimeBasedOnFieldName(fieldName, timeRange);

  if (!isValidTimeFormat(selectedTime)) return false;

  const normalizedTime =
    typeof time === 'string' ? parseTimeString(time) : time;

  return selectedTime
    ? timeToMinutes(selectedTime) === timeToMinutes(normalizedTime)
    : false;
};

export const isNotEqualToTimeRange = (
  timeRange: Maybe<{
    startTime: HourMinute | null;
    endTime: HourMinute | null;
  }>,
  { time, fieldName }: { time: HourMinute; fieldName: string },
): boolean => {
  if (!time || !timeRange) return false;

  const selectedTime = getTimeBasedOnFieldName(fieldName, timeRange);

  if (!isValidTimeFormat(selectedTime)) return false;

  const normalizedTime =
    typeof time === 'string' ? parseTimeString(time) : time;

  return selectedTime
    ? timeToMinutes(selectedTime) !== timeToMinutes(normalizedTime)
    : false;
};

export const isBetweenTimesRange = (
  timeRange: Maybe<{
    startTime: HourMinute | null;
    endTime: HourMinute | null;
  }>,
  {
    minTime,
    maxTime,
    fieldName,
  }: { minTime: HourMinute; maxTime: HourMinute; fieldName: string },
): boolean => {
  if (!timeRange) return false;
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
  timeRange: Maybe<{
    startTime: HourMinute | null;
    endTime: HourMinute | null;
  }>,
  {
    minTime,
    maxTime,
    fieldName,
  }: { minTime: HourMinute; maxTime: HourMinute; fieldName: string },
): boolean => {
  if (!timeRange) return false;
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
  input: Maybe<{ hours: number; minutes: number }>,
  time: { hours: number; minutes: number },
): boolean => {
  if (!isValidTimeFormat(time) || !input) return false;
  const inputMinutes = timeToMinutes(input);
  const conditionMinutes = timeToMinutes(time);

  const result = inputMinutes > conditionMinutes;

  return result;
};

export const isLessThanTime = (
  input: Maybe<{ hours: number; minutes: number }>,
  time: { hours: number; minutes: number },
) => {
  if (!isValidTimeFormat(time) || !input) return false;

  const inputMinutes = timeToMinutes(input);
  const conditionMinutes = timeToMinutes(time);

  const result = inputMinutes < conditionMinutes;

  return result;
};

export const isEqualToTime = (
  input: Maybe<{ hours: number; minutes: number }>,
  time: { hours: number; minutes: number },
) => {
  if (!isValidTimeFormat(time) || !input) return false;

  const inputMinutes = timeToMinutes(input);
  const conditionMinutes = timeToMinutes(time);

  const result = inputMinutes === conditionMinutes;

  return result;
};

export const isNotEqualToTime = (
  input: Maybe<{ hours: number; minutes: number }>,
  time: { hours: number; minutes: number },
) => {
  if (!isValidTimeFormat(time) || !input) return false;

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
  rowValue: number | null,
  minValue: number,
  maxValue: number,
) => {
  return rowValue !== null && (rowValue < minValue || rowValue > maxValue);
};

export const isBetweenSliderRowValues = (
  rowValue: number | null,
  minValue: number,
  maxValue: number,
) => {
  return rowValue !== null && rowValue > minValue && rowValue < maxValue;
};

export const isLessThanSliderRow = (rowValue: number | null, value: number) => {
  return rowValue !== null && rowValue < value;
};

export const isGreaterThanSliderRow = (
  rowValue: number | null,
  value: number,
) => {
  return rowValue !== null && rowValue > value;
};
export const isNotEqualToSliderRow = (
  rowValue: number | null,
  value: number,
) => {
  return rowValue !== null && rowValue !== value;
};

export const isEqualToSliderRow = (rowValue: number | null, value: number) => {
  return rowValue !== null && rowValue === value;
};

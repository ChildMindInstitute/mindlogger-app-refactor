import { timeToMinutes } from "@app/entities/activity/lib/services/timeToMinutes";

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

// and isEqualToOption
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

export const isGreaterThanDate = (input: Maybe<string>, date: string) => {
  if (!input) return false;
  return new Date(input) > new Date(date);
};

export const isLessThanDate = (input: Maybe<string>, date: string) => {
  if (!input) return false;
  return new Date(input) < new Date(date);
};

export const isEqualToDate = (input: Maybe<string>, date: string) => {
  if (!input) return false;
  return new Date(input).getTime() === new Date(date).getTime();
};

export const isNotEqualToDate = (input: Maybe<string>, date: string) => {
  if (!input) return false;
  return new Date(input).getTime() !== new Date(date).getTime();
};

export const isBetweenDates = (
  input: Maybe<string>,
  minDate: string,
  maxDate: string,
) => {
  if (!input) return false;
  const inputDate = new Date(input);
  return inputDate > new Date(minDate) && inputDate < new Date(maxDate);
};

export const isOutsideOfDates = (
  input: Maybe<string>,
  minDate: string,
  maxDate: string,
) => {
  if (!input) return false;
  const inputDate = new Date(input);
  return inputDate < new Date(minDate) || inputDate > new Date(maxDate);
};

export const isGreaterThanTime = (
  input: Maybe<{ hours: number; minutes: number }>,
  time: { hours: number; minutes: number }
): boolean => {
  if (!input) {
    return false;
  }

  const inputMinutes = timeToMinutes(input);
  const conditionMinutes = timeToMinutes(time);

  const result = inputMinutes > conditionMinutes;
  
  return result;
};

export const isLessThanTime = (
  input: Maybe<{ hours: number; minutes: number }>,
  time: { hours: number; minutes: number },
) => {
  if (!input) return false;
  return (
    input.hours < time.hours ||
    (input.hours === time.hours && input.minutes < time.minutes)
  );
};

export const isEqualToTime = (
  input: Maybe<{ hours: number; minutes: number }>,
  time: { hours: number; minutes: number },
) => {
  if (!input) return false;
  return input.hours === time.hours && input.minutes === time.minutes;
};

export const isNotEqualToTime = (
  input: Maybe<{ hours: number; minutes: number }>,
  time: { hours: number; minutes: number },
) => {
  if (!input) return false;
  return input.hours !== time.hours || input.minutes !== time.minutes;
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

import { isBefore, isAfter, isEqual } from 'date-fns';
import { parseISO } from 'date-fns';

import {
  doesNotIncludeValue,
  includesValue,
  isBetweenValues,
  isEqualToValue,
  isGreaterThan,
  isLessThan,
  isOutsideOfValues,
} from '@app/entities/conditional-logic/model/conditions';
import { Item } from '@app/shared/ui/survey/CheckBox/types';
import {
  AnswerValidatorArgs,
  IAnswerValidator,
} from '@features/pass-survey/model/IAnswerValidator';

import {
  ParagraphTextResponse,
  RadioResponse,
  TimeRangeResponse,
} from '../lib/types/payload';

export function AnswerValidator(
  params?: AnswerValidatorArgs,
): IAnswerValidator {
  const { items, answers, step = 0 } = params ?? {};
  const currentPipelineItem = items?.[step];
  const currentAnswer = answers?.[step];

  const getAnswerDate = (): string | null => {
    const answer = currentAnswer?.answer as Maybe<string>;
    return answer ?? null;
  };

  function isValidTimeFormat(time: any): boolean {
    return (
      time && typeof time.hours === 'number' && typeof time.minutes === 'number'
    );
  }
  const getAnswerTime = (): { hours: number; minutes: number } | null => {
    let answer = currentAnswer?.answer as Maybe<{
      hours: number;
      minutes: number;
    }>;

    if (typeof answer === 'string') {
      answer = convertTo24HourFormat(answer);
    }

    return answer ?? null;
  };

  function convert24HourTo12Hour(
    hours: number,
    minutes: number,
  ): { hours: number; minutes: number; period: 'AM' | 'PM' } {
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Converts 0 to 12 for midnight and uses 12-hour format
    return { hours: adjustedHours, minutes, period };
  }

  function convertToMinutes(time: {
    hours: number;
    minutes: number;
    period?: 'AM' | 'PM';
  }): number {
    let totalMinutes = time.hours * 60 + time.minutes;
    if (time.period === 'PM' && time.hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (time.period === 'AM' && time.hours === 12) {
      totalMinutes -= 12 * 60;
    }
    return totalMinutes;
  }

  const getAnswerTimeRange = (): {
    startTime: { hours: number; minutes: number } | null;
    endTime: { hours: number; minutes: number } | null;
  } | null => {
    const answer = currentAnswer?.answer as Maybe<TimeRangeResponse>;
    return answer ?? null;
  };

  const convertTo24HourFormat = (
    timeStr: string,
  ): { hours: number; minutes: number } => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    }
    if (modifier.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  };
  const getSliderRowValue = (rowIndex: number): number | null => {
    const answer = currentAnswer?.answer as Maybe<number[]>;
    return answer && answer[rowIndex] !== undefined ? answer[rowIndex] : null;
  };

  const getRowOptionValue = (rowIndex: number): string | null => {
    const answer = currentAnswer?.answer as Maybe<string[]>;
    return answer && answer[rowIndex] !== undefined ? answer[rowIndex] : null;
  };

  const timeToMinutes = (time: { hours: number; minutes: number }): number => {
    return time.hours * 60 + time.minutes;
  };

  return {
    isCorrect() {
      if (!currentPipelineItem?.validationOptions) {
        return true;
      }

      const { correctAnswer } = currentPipelineItem.validationOptions;
      return correctAnswer === currentAnswer?.answer;
    },

    isEqualToSliderRow(rowIndex: number, value: number) {
      const rowValue = getSliderRowValue(rowIndex);
      return rowValue !== null && rowValue === value;
    },

    isNotEqualToSliderRow(rowIndex: number, value: number) {
      const rowValue = getSliderRowValue(rowIndex);
      return rowValue !== null && rowValue !== value;
    },

    isGreaterThanSliderRow(rowIndex: number, value: number) {
      const rowValue = getSliderRowValue(rowIndex);
      return rowValue !== null && rowValue > value;
    },

    isLessThanSliderRow(rowIndex: number, value: number) {
      const rowValue = getSliderRowValue(rowIndex);
      return rowValue !== null && rowValue < value;
    },

    isBetweenSliderRowValues(
      rowIndex: number,
      minValue: number,
      maxValue: number,
    ) {
      const rowValue = getSliderRowValue(rowIndex);
      return rowValue !== null && rowValue >= minValue && rowValue <= maxValue;
    },

    isOutsideOfSliderRowValues(
      rowIndex: number,
      minValue: number,
      maxValue: number,
    ) {
      const rowValue = getSliderRowValue(rowIndex);
      return rowValue !== null && (rowValue < minValue || rowValue > maxValue);
    },

    // Methods for options per row
    isEqualToRowOption(rowIndex: number, optionValue: string) {
      const selectedOption = getRowOptionValue(rowIndex);
      return selectedOption !== null && selectedOption === optionValue;
    },

    isNotEqualToRowOption(rowIndex: number, optionValue: string) {
      const selectedOption = getRowOptionValue(rowIndex);
      return selectedOption !== null && selectedOption !== optionValue;
    },

    includesRowOption(rowIndex: number, optionValue: string) {
      const selectedOption = getRowOptionValue(rowIndex);
      return (
        selectedOption !== null && includesValue([selectedOption], optionValue)
      );
    },

    notIncludesRowOption(rowIndex: number, optionValue: string) {
      const selectedOption = getRowOptionValue(rowIndex);
      return (
        selectedOption !== null &&
        doesNotIncludeValue([selectedOption], optionValue)
      );
    },

    isBetweenValues(min: number, max: number) {
      const answer = currentAnswer?.answer as Maybe<number>;
      return isBetweenValues(answer, min, max);
    },

    isOutsideOfValues(min: number, max: number) {
      const answer = currentAnswer?.answer as Maybe<number>;
      return isOutsideOfValues(answer, min, max);
    },

    isEqualToValue(value: any) {
      const answer = currentAnswer?.answer as Maybe<unknown>;
      return isEqualToValue(answer, value);
    },

    isEqualToOption(optionValue: string) {
      const answer = currentAnswer?.answer as Maybe<RadioResponse>;
      const selectedOption = answer?.value?.toString();
      return isEqualToValue(selectedOption, optionValue);
    },

    isGreaterThan(value: number) {
      const answer = currentAnswer?.answer as Maybe<number>;
      return isGreaterThan(answer, value);
    },

    isLessThan(value: number) {
      const answer = currentAnswer?.answer as Maybe<number>;
      return isLessThan(answer, value);
    },

    includesOption(optionValue: string) {
      const answer = (currentAnswer?.answer as Maybe<Item[]>)?.map(item =>
        item.value.toString(),
      );
      return includesValue(answer, optionValue);
    },

    notIncludesOption(optionValue: string) {
      const answer = (currentAnswer?.answer as Maybe<Item[]>)?.map(item =>
        item.value.toString(),
      );
      return doesNotIncludeValue(answer, optionValue);
    },

    isGreaterThanDate(date: string) {
      const answerDate = getAnswerDate();
      return answerDate ? isAfter(parseISO(answerDate), parseISO(date)) : false;
    },

    isLessThanDate(date: string) {
      const answerDate = getAnswerDate();
      return answerDate
        ? isBefore(parseISO(answerDate), parseISO(date))
        : false;
    },

    isEqualToDate(date: string) {
      const answerDate = getAnswerDate();
      return answerDate ? isEqual(parseISO(answerDate), parseISO(date)) : false;
    },

    isNotEqualToDate(date: string) {
      const answerDate = getAnswerDate();
      return answerDate
        ? !isEqual(parseISO(answerDate), parseISO(date))
        : false;
    },

    isBetweenDates(minDate: string, maxDate: string) {
      const answerDate = getAnswerDate();
      return answerDate
        ? !isBefore(parseISO(answerDate), parseISO(minDate)) &&
            !isAfter(parseISO(answerDate), parseISO(maxDate))
        : false;
    },

    isOutsideOfDates(minDate: string, maxDate: string) {
      const answerDate = getAnswerDate();
      return answerDate
        ? isBefore(parseISO(answerDate), parseISO(minDate)) ||
            isAfter(parseISO(answerDate), parseISO(maxDate))
        : false;
    },

    isGreaterThanTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();

      if (!isValidTimeFormat(time)) {
        return false;
      }

      const normalizedTime = timeToMinutes(time);
      const normalizedAnswerTime = answerTime
        ? timeToMinutes(answerTime)
        : null;

      return (
        normalizedAnswerTime !== null && normalizedAnswerTime > normalizedTime
      );
    },

    isLessThanTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();
      if (!answerTime) return false;

      const backendTimeInMinutes = convertToMinutes(
        convert24HourTo12Hour(time.hours, time.minutes),
      );
      const answerTimeInMinutes = convertToMinutes(answerTime);

      return answerTimeInMinutes < backendTimeInMinutes;
    },

    isEqualToTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();
      if (!answerTime) return false;

      const backendTimeInMinutes = convertToMinutes(
        convert24HourTo12Hour(time.hours, time.minutes),
      );
      const answerTimeInMinutes = convertToMinutes(answerTime);

      return answerTimeInMinutes === backendTimeInMinutes;
    },

    isNotEqualToTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();
      if (!answerTime) return false;

      const backendTimeInMinutes = convertToMinutes(
        convert24HourTo12Hour(time.hours, time.minutes),
      );
      const answerTimeInMinutes = convertToMinutes(answerTime);

      return answerTimeInMinutes !== backendTimeInMinutes;
    },

    isBetweenTimes(
      minTime: { hours: number; minutes: number },
      maxTime: { hours: number; minutes: number },
    ) {
      const answerTime = getAnswerTime();
      if (!answerTime) return false;

      const minTimeInMinutes = convertToMinutes(
        convert24HourTo12Hour(minTime.hours, minTime.minutes),
      );
      const maxTimeInMinutes = convertToMinutes(
        convert24HourTo12Hour(maxTime.hours, maxTime.minutes),
      );
      const answerTimeInMinutes = convertToMinutes(answerTime);

      return (
        answerTimeInMinutes >= minTimeInMinutes &&
        answerTimeInMinutes <= maxTimeInMinutes
      );
    },

    isOutsideOfTimes(
      minTime: { hours: number; minutes: number },
      maxTime: { hours: number; minutes: number },
    ) {
      const answerTime = getAnswerTime();
      if (!answerTime) return false;

      const minTimeInMinutes = convertToMinutes(
        convert24HourTo12Hour(minTime.hours, minTime.minutes),
      );
      const maxTimeInMinutes = convertToMinutes(
        convert24HourTo12Hour(maxTime.hours, maxTime.minutes),
      );
      const answerTimeInMinutes = convertToMinutes(answerTime);

      return (
        answerTimeInMinutes < minTimeInMinutes ||
        answerTimeInMinutes > maxTimeInMinutes
      );
    },

    isGreaterThanTimeRange(time: {
      hours: number;
      minutes: number;
      fieldName?: 'from' | 'to';
    }) {
      if (
        !time ||
        typeof time.hours !== 'number' ||
        typeof time.minutes !== 'number'
      ) {
        return false;
      }

      const answerTimeRange = getAnswerTimeRange();

      if (
        !answerTimeRange ||
        (!answerTimeRange.startTime && !answerTimeRange.endTime)
      ) {
        return false;
      }

      const fieldName = time.fieldName || 'from';
      const answerTime =
        fieldName === 'from'
          ? answerTimeRange.startTime
          : answerTimeRange.endTime;

      if (!answerTime) {
        return false;
      }

      const normalizedConditionTime = timeToMinutes(time);
      const normalizedAnswerTime = timeToMinutes(answerTime);

      return normalizedAnswerTime > normalizedConditionTime;
    },

    isLessThanTimeRange(time: { hours: number; minutes: number }) {
      const answerTimeRange = getAnswerTimeRange();
      if (!answerTimeRange || !answerTimeRange.startTime) {
        return false;
      }
      return timeToMinutes(answerTimeRange.startTime) < timeToMinutes(time);
    },

    isEqualToTimeRange(time: { hours: number; minutes: number }) {
      const answerTimeRange = getAnswerTimeRange();
      if (!answerTimeRange || !answerTimeRange.startTime) {
        return false;
      }
      return timeToMinutes(answerTimeRange.startTime) === timeToMinutes(time);
    },

    isNotEqualToTimeRange(time: { hours: number; minutes: number }) {
      const answerTimeRange = getAnswerTimeRange();
      if (!answerTimeRange || !answerTimeRange.startTime) {
        return false;
      }
      return timeToMinutes(answerTimeRange.startTime) !== timeToMinutes(time);
    },

    isBetweenTimesRange(
      minTime: { hours: number; minutes: number },
      maxTime: { hours: number; minutes: number },
    ) {
      const answerTimeRange = getAnswerTimeRange();
      if (!answerTimeRange || !answerTimeRange.startTime) {
        return false;
      }
      const answerMinutes = timeToMinutes(answerTimeRange.startTime);
      return (
        answerMinutes >= timeToMinutes(minTime) &&
        answerMinutes <= timeToMinutes(maxTime)
      );
    },

    isOutsideOfTimesRange(
      minTime: { hours: number; minutes: number },
      maxTime: { hours: number; minutes: number },
    ) {
      const answerTimeRange = getAnswerTimeRange();
      if (!answerTimeRange || !answerTimeRange.startTime) {
        return false;
      }
      const answerMinutes = timeToMinutes(answerTimeRange.startTime);
      return (
        answerMinutes < timeToMinutes(minTime) ||
        answerMinutes > timeToMinutes(maxTime)
      );
    },

    isValidAnswer() {
      switch (currentPipelineItem?.type) {
        case 'TimeRange': {
          const answer = currentAnswer?.answer as TimeRangeResponse;

          if (answer) {
            return !!answer?.startTime && !!answer?.endTime;
          }

          return true;
        }
        case 'ParagraphText': {
          const paragraphResponse =
            currentAnswer?.answer as ParagraphTextResponse;
          const limit = currentPipelineItem.payload.maxLength;

          if (limit < paragraphResponse.length) {
            return false;
          }

          return true;
        }
        default:
          return true;
      }
    },
  };
}

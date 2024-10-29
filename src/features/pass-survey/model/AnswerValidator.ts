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

import { isBefore, isAfter, isEqual } from 'date-fns';
import { parseISO } from 'date-fns';

export function AnswerValidator(params?: AnswerValidatorArgs): IAnswerValidator {
  const { items, answers, step = 0 } = params ?? {};
  const currentPipelineItem = items?.[step];
  const currentAnswer = answers?.[step];

  const getAnswerDate = (): string | null => {
    const answer = currentAnswer?.answer as Maybe<string>;
    return answer ?? null;
  };
  
  const getAnswerTime = (): { hours: number; minutes: number } | null => {
    const answer = currentAnswer?.answer as Maybe<{ hours: number; minutes: number }>;
    return answer ?? null;
  };

  const getAnswerTimeRange = (): {
    startTime: { hours: number; minutes: number } | null;
    endTime: { hours: number; minutes: number } | null;
  } | null => {
    const answer = currentAnswer?.answer as Maybe<TimeRangeResponse>;
    return answer ?? null;
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

    isBetweenSliderRowValues(rowIndex: number, minValue: number, maxValue: number) {
      const rowValue = getSliderRowValue(rowIndex);
      return rowValue !== null && rowValue >= minValue && rowValue <= maxValue;
    },

    isOutsideOfSliderRowValues(rowIndex: number, minValue: number, maxValue: number) {
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
      return selectedOption !== null && includesValue([selectedOption], optionValue);
    },

    notIncludesRowOption(rowIndex: number, optionValue: string) {
      const selectedOption = getRowOptionValue(rowIndex);
      return selectedOption !== null && doesNotIncludeValue([selectedOption], optionValue);
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
      return answerDate ? isBefore(parseISO(answerDate), parseISO(date)) : false;
    },

    isEqualToDate(date: string) {
      const answerDate = getAnswerDate();
      return answerDate ? isEqual(parseISO(answerDate), parseISO(date)) : false;
    },

    isNotEqualToDate(date: string) {
      const answerDate = getAnswerDate();
      return answerDate ? !isEqual(parseISO(answerDate), parseISO(date)) : false;
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
      return answerTime
        ? timeToMinutes(answerTime) > timeToMinutes(time)
        : false;
    },

    isLessThanTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();
      return answerTime
        ? timeToMinutes(answerTime) < timeToMinutes(time)
        : false;
    },

    isEqualToTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();
      return answerTime
        ? timeToMinutes(answerTime) === timeToMinutes(time)
        : false;
    },

    isNotEqualToTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();
      return answerTime
        ? timeToMinutes(answerTime) !== timeToMinutes(time)
        : false;
    },

    isBetweenTimes(
      minTime: { hours: number; minutes: number },
      maxTime: { hours: number; minutes: number },
    ) {
      const answerTime = getAnswerTime();
      return answerTime
        ? timeToMinutes(answerTime) >= timeToMinutes(minTime) &&
          timeToMinutes(answerTime) <= timeToMinutes(maxTime)
        : false;
    },

    isOutsideOfTimes(
      minTime: { hours: number; minutes: number },
      maxTime: { hours: number; minutes: number },
    ) {
      const answerTime = getAnswerTime();
      return answerTime
        ? timeToMinutes(answerTime) < timeToMinutes(minTime) ||
          timeToMinutes(answerTime) > timeToMinutes(maxTime)
        : false;
    },

    isGreaterThanTimeRange(time: { hours: number; minutes: number }) {
      const answerTimeRange = getAnswerTimeRange();
      if (!answerTimeRange || !answerTimeRange.startTime) {
        return false;
      }
      return timeToMinutes(answerTimeRange.startTime) > timeToMinutes(time);
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

import {
  doesNotIncludeValue,
  includesValue,
  isBetweenValues,
  isEqualToValue,
  isGreaterThan,
  isLessThan,
  isOutsideOfValues,
  isGreaterThanTime,
  isLessThanTime,
  isEqualToTime,
  isNotEqualToTime,
  isNotEqualToDate,
  isBetweenDates,
  isBetweenTimes,
  isGreaterThanTimeRange,
  isLessThanTimeRange,
  isEqualToTimeRange,
  isNotEqualToTimeRange,
  isBetweenTimesRange,
  isOutsideOfTimesRange,
  isOutsideOfTimes,
  isOutsideOfSliderRowValues,
  isBetweenSliderRowValues,
  isLessThanSliderRow,
  isGreaterThanSliderRow,
  isNotEqualToSliderRow,
  isEqualToSliderRow,
  isGreaterThanDate,
  isLessThanDate,
  isEqualToDate,
  isOutsideOfDates,
} from '@app/entities/conditional-logic/model/conditions';
import { HourMinute } from '@app/shared/lib/types/dateTime';
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
    const [hoursStr, minutesStr] = time.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    let adjustedHours = hours;
    if (modifier.toLowerCase() === 'pm' && hours < 12) {
      adjustedHours += 12;
    }
    if (modifier.toLowerCase() === 'am' && hours === 12) {
      adjustedHours = 0;
    }

    return { hours: adjustedHours, minutes };
  };

  const getSliderRowValue = (rowIndex: number): number | null => {
    const answer = currentAnswer?.answer as Maybe<number[]>;
    return answer && answer[rowIndex] !== undefined ? answer[rowIndex] : null;
  };

  const getRowOptionValues = (rowIndex: number): string[] | null => {
    const answer = currentAnswer?.answer as Maybe<
      { id: string; text: string }[][]
    >;
    if (answer && answer[rowIndex]) {
      const optionIds = answer[rowIndex].map(option => option.id);
      return optionIds;
    }
    return null;
  };

  const getSelectionRowOptionValue = (rowIndex: number): string | null => {
    const answer = currentAnswer?.answer as Maybe<
      { id: string; text: string }[]
    >;

    if (answer && answer[rowIndex]) {
      const optionIds = answer[rowIndex].id;

      return optionIds;
    }
    return null;
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
      return isEqualToSliderRow(rowValue, value);
    },

    isNotEqualToSliderRow(rowIndex: number, value: number) {
      const rowValue = getSliderRowValue(rowIndex);
      return isNotEqualToSliderRow(rowValue, value);
    },

    isGreaterThanSliderRow(rowIndex: number, value: number) {
      const rowValue = getSliderRowValue(rowIndex);

      return isGreaterThanSliderRow(rowValue, value);
    },

    isLessThanSliderRow(rowIndex: number, value: number) {
      const rowValue = getSliderRowValue(rowIndex);
      return isLessThanSliderRow(rowValue, value);
    },

    isBetweenSliderRowValues(
      rowIndex: number,
      minValue: number,
      maxValue: number,
    ) {
      const rowValue = getSliderRowValue(rowIndex);

      return isBetweenSliderRowValues(rowValue, minValue, maxValue);
    },

    isOutsideOfSliderRowValues(
      rowIndex: number,
      minValue: number,
      maxValue: number,
    ) {
      const rowValue = getSliderRowValue(rowIndex);

      return isOutsideOfSliderRowValues(rowValue, minValue, maxValue);
    },

    isEqualToRowOption(rowIndex: number, optionValue: string) {
      const selectedOption = getSelectionRowOptionValue(rowIndex);
      return selectedOption !== null && selectedOption.includes(optionValue);
    },

    isNotEqualToRowOption(rowIndex: number, optionValue: string) {
      const selectedOption = getSelectionRowOptionValue(rowIndex);
      return selectedOption !== null && !selectedOption.includes(optionValue);
    },

    includesRowOption(rowIndex: number, optionValue: string) {
      const selectedOptions = getRowOptionValues(Number(rowIndex));
      return (
        selectedOptions !== null && includesValue(selectedOptions, optionValue)
      );
    },

    notIncludesRowOption(rowIndex: number, optionValue: string) {
      const selectedOptions = getRowOptionValues(Number(rowIndex));
      return (
        selectedOptions !== null &&
        doesNotIncludeValue(selectedOptions, optionValue)
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
      return isGreaterThanDate(answerDate, date);
    },

    isLessThanDate(date: string) {
      const answerDate = getAnswerDate();
      return isLessThanDate(answerDate, date);
    },

    isEqualToDate(date: string) {
      const answerDate = getAnswerDate();
      return isEqualToDate(answerDate, date);
    },

    isNotEqualToDate(date: string) {
      const answerDate = getAnswerDate();
      return isNotEqualToDate(answerDate, date);
    },

    isBetweenDates(minDate: string, maxDate: string) {
      const answerDate = getAnswerDate();
      return isBetweenDates(answerDate, minDate, maxDate);
    },

    isOutsideOfDates(minDate: string, maxDate: string) {
      const answerDate = getAnswerDate();
      return isOutsideOfDates(answerDate, minDate, maxDate);
    },

    isGreaterThanTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();
      return isGreaterThanTime(answerTime, time);
    },

    isLessThanTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();

      return isLessThanTime(answerTime, time);
    },

    isEqualToTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();

      return isEqualToTime(answerTime, time);
    },

    isNotEqualToTime(time: { hours: number; minutes: number }) {
      const answerTime = getAnswerTime();

      return isNotEqualToTime(answerTime, time);
    },

    isBetweenTimes(
      minTime: { hours: number; minutes: number },
      maxTime: { hours: number; minutes: number },
    ) {
      const answerTime = getAnswerTime();
      return isBetweenTimes(answerTime, minTime, maxTime);
    },

    isOutsideOfTimes(
      minTime: { hours: number; minutes: number },
      maxTime: { hours: number; minutes: number },
    ) {
      const answerTime = getAnswerTime();
      return isOutsideOfTimes(answerTime, minTime, maxTime);
    },

    isGreaterThanTimeRange(time: HourMinute, fieldName: string) {
      const answerTimeRange = getAnswerTimeRange();

      return isGreaterThanTimeRange(answerTimeRange, { time, fieldName });
    },

    isEqualToTimeRange(time: HourMinute, fieldName: string) {
      const answerTimeRange = getAnswerTimeRange();

      return isEqualToTimeRange(answerTimeRange, { time, fieldName });
    },

    isLessThanTimeRange(time: HourMinute, fieldName: string) {
      const answerTimeRange = getAnswerTimeRange();
      return isLessThanTimeRange(answerTimeRange, { time, fieldName });
    },

    isNotEqualToTimeRange(time: HourMinute, fieldName: string) {
      const answerTimeRange = getAnswerTimeRange();
      return isNotEqualToTimeRange(answerTimeRange, { time, fieldName });
    },
    isBetweenTimesRange(
      minTime: HourMinute,
      maxTime: HourMinute,
      fieldName: string,
    ) {
      const answerTimeRange = getAnswerTimeRange();
      return isBetweenTimesRange(answerTimeRange, {
        minTime,
        maxTime,
        fieldName,
      });
    },

    isOutsideOfTimesRange(
      minTime: HourMinute,
      maxTime: HourMinute,
      fieldName: string,
    ) {
      const answerTimeRange = getAnswerTimeRange();

      return isOutsideOfTimesRange(answerTimeRange, {
        minTime,
        maxTime,
        fieldName,
      });
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

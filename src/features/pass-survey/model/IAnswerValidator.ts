import { Answers } from '@features/pass-survey/lib/hooks/useActivityStorageRecord';
import { PipelineItem } from '@features/pass-survey/lib/types/payload';

export type AnswerValidatorArgs = {
  items: PipelineItem[];
  answers: Answers;
  step: number;
};

export interface IAnswerValidator {
  isCorrect(): boolean;

  isBetweenValues(min: number, max: number): boolean;

  isOutsideOfValues(min: number, max: number): boolean;

  isEqualToValue(value: any): boolean;

  isEqualToOption(optionValue: string): boolean;

  isGreaterThan(value: number): boolean;

  isLessThan(value: number): boolean;

  includesOption(optionValue: string): boolean;

  notIncludesOption(optionValue: string): boolean;

  isGreaterThanDate(date: string): boolean;

  isLessThanDate(date: string): boolean;

  isEqualToDate(date: string): boolean;

  isNotEqualToDate(date: string): boolean;

  isBetweenDates(minDate: string, maxDate: string): boolean;

  isOutsideOfDates(minDate: string, maxDate: string): boolean;

  isGreaterThanTime(time: { hours: number; minutes: number }): boolean;

  isLessThanTime(time: { hours: number; minutes: number }): boolean;

  isEqualToTime(time: { hours: number; minutes: number }): boolean;

  isNotEqualToTime(time: { hours: number; minutes: number }): boolean;

  isBetweenTimes(
    minTime: { hours: number; minutes: number },
    maxTime: { hours: number; minutes: number },
  ): boolean;

  isOutsideOfTimes(
    minTime: { hours: number; minutes: number },
    maxTime: { hours: number; minutes: number },
  ): boolean;

  isGreaterThanTimeRange(time: { hours: number; minutes: number }): boolean;

  isLessThanTimeRange(time: { hours: number; minutes: number }): boolean;

  isEqualToTimeRange(time: { hours: number; minutes: number }): boolean;

  isNotEqualToTimeRange(time: { hours: number; minutes: number }): boolean;

  isBetweenTimesRange(
    minTime: { hours: number; minutes: number },
    maxTime: { hours: number; minutes: number },
  ): boolean;

  isOutsideOfTimesRange(
    minTime: { hours: number; minutes: number },
    maxTime: { hours: number; minutes: number },
  ): boolean;
  isEqualToSliderRow(rowIndex: number, value: number): boolean;

  isNotEqualToSliderRow(rowIndex: number, value: number): boolean;

  isGreaterThanSliderRow(rowIndex: number, value: number): boolean;

  isLessThanSliderRow(rowIndex: number, value: number): boolean;

  isBetweenSliderRowValues(
    rowIndex: number,
    minValue: number,
    maxValue: number,
  ): boolean;

  isOutsideOfSliderRowValues(
    rowIndex: number,
    minValue: number,
    maxValue: number,
  ): boolean;

  isEqualToRowOption(rowIndex: number, optionValue: string): boolean;

  isNotEqualToRowOption(rowIndex: number, optionValue: string): boolean;

  includesRowOption(rowIndex: number, optionValue: string): boolean;

  notIncludesRowOption(rowIndex: number, optionValue: string): boolean;

  isValidAnswer(): boolean;
}

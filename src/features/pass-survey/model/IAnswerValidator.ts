import { Answers } from '@features/pass-survey/lib/hooks/useActivityStorageRecord.ts';
import { PipelineItem } from '@features/pass-survey/lib/types/payload.ts';

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

  isGreaterThen(value: number): boolean;

  isLessThen(value: number): boolean;

  includesOption(optionValue: string): boolean;

  notIncludesOption(optionValue: string): boolean;

  isValidAnswer(): boolean;
}

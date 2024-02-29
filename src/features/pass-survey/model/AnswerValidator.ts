import { Item } from '@app/shared/ui';
import { ConditionalLogicModel } from '@entities/conditional-logic';

import { Answers, PipelineItem, RadioResponse } from '../lib';

type AnswerValidatorArgs = {
  items: PipelineItem[];
  answers: Answers;
  step: number;
};

function AnswerValidator(params?: AnswerValidatorArgs) {
  const { items, answers, step = 0 } = params ?? {};
  const currentPipelineItem = items?.[step];
  const currentAnswer = answers?.[step];

  return {
    isCorrect() {
      if (!currentPipelineItem?.validationOptions) {
        return true;
      }

      const { correctAnswer } = currentPipelineItem.validationOptions;

      return correctAnswer === currentAnswer?.answer;
    },

    isBetweenValues(min: number, max: number) {
      const answer = currentAnswer?.answer as Maybe<number>;

      return ConditionalLogicModel.isBetweenValues(answer, min, max);
    },

    isOutsideOfValues(min: number, max: number) {
      const answer = currentAnswer?.answer as Maybe<number>;

      return ConditionalLogicModel.isOutsideOfValues(answer, min, max);
    },

    isEqualToValue(value: any) {
      const answer = currentAnswer?.answer as Maybe<unknown>;

      return ConditionalLogicModel.isEqualToValue(answer, value);
    },

    isEqualToOption(optionValue: string) {
      const answer = currentAnswer?.answer as Maybe<RadioResponse>;
      const selectedOption = answer?.value?.toString();

      return ConditionalLogicModel.isEqualToValue(selectedOption, optionValue);
    },

    isGreaterThen(value: number) {
      const answer = currentAnswer?.answer as Maybe<number>;

      return ConditionalLogicModel.isGreaterThan(answer, value);
    },

    isLessThen(value: number) {
      const answer = currentAnswer?.answer as Maybe<number>;

      return ConditionalLogicModel.isLessThan(answer, value);
    },

    includesOption(optionValue: string) {
      const answer = (currentAnswer?.answer as Maybe<Item[]>)?.map(item =>
        item.value.toString(),
      );

      return ConditionalLogicModel.includesValue(answer, optionValue);
    },

    notIncludesOption(optionValue: string) {
      const answer = (currentAnswer?.answer as Maybe<Item[]>)?.map(item =>
        item.value.toString(),
      );

      return ConditionalLogicModel.doesNotIncludeValue(answer, optionValue);
    },
  };
}

export default AnswerValidator;

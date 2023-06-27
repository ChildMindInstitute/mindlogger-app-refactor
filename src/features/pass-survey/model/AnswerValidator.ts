import { Item } from '@app/shared/ui';

import { Answers, PipelineItem } from '../lib';

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
    isValid() {
      if (!currentPipelineItem?.validationOptions) {
        return true;
      }

      const { correctAnswer } = currentPipelineItem.validationOptions;

      return correctAnswer === currentAnswer?.answer;
    },

    isBetweenValues(min: number, max: number) {
      if (currentAnswer?.answer == null) {
        return false;
      }

      const answer = currentAnswer.answer as number;

      return answer > min && answer < max;
    },

    isOutsideOfValues(min: number, max: number) {
      if (currentAnswer?.answer == null) {
        return false;
      }

      const answer = currentAnswer.answer as number;

      return answer < min || answer > max;
    },

    isEqualToValue(value: any) {
      if (currentAnswer?.answer == null) {
        return false;
      }

      const answer = currentAnswer.answer as number;

      return answer === value;
    },

    isEqualToOption(optionValue: string) {
      if (currentAnswer?.answer == null) {
        return false;
      }

      return currentAnswer.answer === optionValue;
    },

    isGreaterThen(value: number) {
      if (currentAnswer?.answer == null) {
        return false;
      }

      const answer = currentAnswer.answer as number;

      return answer > value;
    },

    isLessThen(value: number) {
      if (currentAnswer?.answer == null) {
        return false;
      }

      const answer = currentAnswer.answer as number;

      return answer < value;
    },

    includesOption(optionValue: string) {
      if (currentAnswer?.answer == null) {
        return false;
      }

      const answer = currentAnswer.answer as Item[];

      return answer.find(
        answerItem => String(answerItem.value) === optionValue,
      );
    },
  };
}

export default AnswerValidator;

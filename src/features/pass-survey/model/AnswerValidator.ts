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
} from '@features/pass-survey/model/IAnswerValidator.ts';

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

    isGreaterThen(value: number) {
      const answer = currentAnswer?.answer as Maybe<number>;

      return isGreaterThan(answer, value);
    },

    isLessThen(value: number) {
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

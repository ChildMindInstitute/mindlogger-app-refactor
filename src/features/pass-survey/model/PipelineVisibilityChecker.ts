import AnswerValidator from './AnswerValidator';
import { Answers, PipelineItem } from '../lib';

function PipelineVisibilityChecker(pipeline: PipelineItem[], answers: Answers) {
  function isItemVisible(index: number) {
    const item = pipeline[index];
    const conditionalLogics = item.conditionalLogics;

    return (
      !conditionalLogics ||
      conditionalLogics.every(conditionalLogic => {
        const method = conditionalLogic.match === 'ALL' ? 'every' : 'some';

        return conditionalLogic.conditions[method](condition => {
          const step = pipeline.findIndex(
            x => x.name === condition.activityItemName,
          );

          const answerValidator = AnswerValidator({
            step,
            answers,
            items: pipeline,
          });

          switch (condition.type) {
            case 'BETWEEN':
              return answerValidator.isBetweenValues(
                condition.payload.minValue,
                condition.payload.maxValue,
              );

            case 'OUTSIDE_OF': {
              return !answerValidator.isBetweenValues(
                condition.payload.minValue,
                condition.payload.maxValue,
              );
            }

            case 'EQUAL':
              return answerValidator.isEqualToValue(condition.payload.value);

            case 'NOT_EQUAL':
              return !answerValidator.isEqualToValue(condition.payload.value);

            case 'EQUAL_TO_OPTION':
              return answerValidator.isEqualToOption(
                condition.payload.optionId,
              );

            case 'NOT_EQUAL_TO_OPTION':
              return !answerValidator.isEqualToOption(
                condition.payload.optionId,
              );

            case 'GREATER_THAN':
              return answerValidator.isGreaterThen(condition.payload.value);

            case 'LESS_THAN':
              return answerValidator.isLessThen(condition.payload.value);

            case 'INCLUDES_OPTION':
              return answerValidator.includesOption(condition.payload.optionId);

            case 'NOT_INCLUDES_OPTION':
              return !answerValidator.includesOption(
                condition.payload.optionId,
              );

            default:
              return true;
          }
        });
      })
    );
  }

  return {
    isItemVisible,
  };
}

export default PipelineVisibilityChecker;

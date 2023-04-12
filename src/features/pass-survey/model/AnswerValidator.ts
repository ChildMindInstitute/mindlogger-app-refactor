import { ActivityState } from '../lib';

function AnswerValidator(activityState: ActivityState | undefined) {
  const currentPipelineItem = activityState?.items?.[activityState.step];
  const currentAnswer = activityState?.answers?.[activityState.step];

  return {
    isValid() {
      if (!currentPipelineItem?.validationOptions) {
        return true;
      }

      const { correctAnswer } = currentPipelineItem.validationOptions;

      return correctAnswer === currentAnswer?.answer;
    },
  };
}

export default AnswerValidator;

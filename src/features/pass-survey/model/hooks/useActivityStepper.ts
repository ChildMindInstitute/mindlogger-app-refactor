import { ActivityState, onIncorrectAnswerGiven } from '../../lib';
import AnswerValidator from '../AnswerValidator';

function useActivityStepper(state: ActivityState | undefined) {
  const step = state?.step ?? 0;
  const items = state?.items ?? [];
  const answers = state?.answers ?? {};

  const currentPipelineItem = state?.items[step];

  const isTutorialStep = currentPipelineItem?.type === 'Tutorial';
  const isFirstStep = step === 0;
  const isLastStep = items && step === items.length - 1;

  const additionalAnswerRequired =
    currentPipelineItem?.additionalText?.required;

  const hasAnswer = !!answers[step]?.answer;
  const hasAdditionalAnswer = !!answers[step]?.additionalAnswer;

  const canMoveNext =
    isTutorialStep ||
    currentPipelineItem?.isSkippable ||
    (hasAnswer && (!additionalAnswerRequired || hasAdditionalAnswer));
  const canMoveBack = currentPipelineItem?.isAbleToMoveToPrevious;
  const canReset = currentPipelineItem?.canBeReset && hasAnswer;
  const showTopNavigation = currentPipelineItem?.hasTopNavigation;
  const showBottomNavigation = !showTopNavigation;

  const answerValidator = AnswerValidator(state);

  function isValid() {
    const valid = answerValidator.isValid();

    if (!valid) {
      onIncorrectAnswerGiven();
    }

    return valid;
  }

  return {
    isTutorialStep,
    isFirstStep,
    isLastStep,

    canMoveNext,
    canMoveBack,
    canReset,

    showTopNavigation,
    showBottomNavigation,

    isValid,
  };
}

export default useActivityStepper;

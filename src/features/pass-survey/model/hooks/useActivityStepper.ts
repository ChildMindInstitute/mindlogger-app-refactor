import { ActivityState, onIncorrectAnswerGiven } from '../../lib';
import AnswerValidator from '../AnswerValidator';

function useActivityStepper(state: ActivityState | undefined) {
  const step = state?.step ?? 0;
  const items = state?.items ?? [];
  const answers = state?.answers ?? {};

  const currentPipelineItem = state?.items[step];

  const isTutorialStep = currentPipelineItem?.type === 'Tutorial';
  const isLastStep = items && step === items.length - 1;

  const additionalAnswerRequired =
    currentPipelineItem?.additionalText?.required;

  const canMoveNext =
    isTutorialStep ||
    currentPipelineItem?.isSkippable ||
    (!!answers[step]?.answer &&
      (!additionalAnswerRequired || !!answers[step]?.additionalAnswer));
  const canMoveBack = currentPipelineItem?.isAbleToMoveToPrevious;
  const canReset = currentPipelineItem?.canBeReset;
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

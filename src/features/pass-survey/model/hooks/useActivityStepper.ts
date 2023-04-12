import { ActivityState, onIncorrectAnswerGiven } from '../../lib';
import AnswerValidator from '../AnswerValidator';

function useActivityStepper(state: ActivityState | undefined) {
  const step = state?.step ?? 0;
  const items = state?.items ?? [];
  const answers = state?.answers ?? {};

  const currentPipelineItem = state?.items[step];

  const isTutorialStep = currentPipelineItem?.type === 'Tutorial';
  const isSplashStep = currentPipelineItem?.type === 'Splash';
  const isFirstStep = step === 0;
  const isLastStep = items && step === items.length - 1;

  const additionalAnswerRequired =
    currentPipelineItem?.additionalText?.required;

  const hasAnswer =
    answers[step]?.answer != null && answers[step]?.answer !== '';
  const hasAdditionalAnswer =
    answers[step]?.additionalAnswer != null &&
    answers[step]?.additionalAnswer !== '';

  const canSkip =
    !!currentPipelineItem?.isSkippable && !hasAnswer && !isSplashStep;
  const canMoveNext =
    isTutorialStep ||
    currentPipelineItem?.isSkippable ||
    (hasAnswer && (!additionalAnswerRequired || hasAdditionalAnswer));
  const canMoveBack = currentPipelineItem?.isAbleToMoveBack;
  const canReset = currentPipelineItem?.canBeReset && hasAnswer;
  const showTopNavigation = currentPipelineItem?.hasTopNavigation;
  const showBottomNavigation = !showTopNavigation;
  const showWatermark = !isSplashStep && !showTopNavigation;

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

    canSkip,
    canMoveNext,
    canMoveBack,
    canReset,

    showWatermark,
    showTopNavigation,
    showBottomNavigation,

    isValid,
  };
}

export default useActivityStepper;

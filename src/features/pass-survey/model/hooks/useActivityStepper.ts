import {
  ActivityItemType,
  ActivityState,
  onIncorrectAnswerGiven,
} from '../../lib';
import AnswerValidator from '../AnswerValidator';
import StepperUtils from '../StepperUtils';

const ConditionalLogicItems: ActivityItemType[] = [
  'Radio',
  'Checkbox',
  'Slider',
];

function useActivityStepper(state: ActivityState | undefined) {
  const step = state?.step ?? 0;
  const items = state?.items ?? [];
  const answers = state?.answers ?? {};

  const currentPipelineItem = state?.items[step];

  const isTutorialStep = currentPipelineItem?.type === 'Tutorial';
  const isMessageStep = currentPipelineItem?.type === 'Message';
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
    isMessageStep ||
    currentPipelineItem?.isSkippable ||
    (hasAnswer && (!additionalAnswerRequired || hasAdditionalAnswer));
  const canMoveBack = currentPipelineItem?.isAbleToMoveBack;
  const canReset =
    currentPipelineItem?.canBeReset && (hasAnswer || hasAdditionalAnswer);
  const showTopNavigation = currentPipelineItem?.hasTopNavigation;
  const showBottomNavigation = !showTopNavigation;
  const showWatermark = !isSplashStep && !showTopNavigation;

  const isConditionalLogicItem = ConditionalLogicItems.includes(
    currentPipelineItem!?.type,
  );

  const answerValidator = AnswerValidator(state);

  function isValid() {
    const valid = answerValidator.isCorrect();

    if (!valid) {
      onIncorrectAnswerGiven();
    }

    return valid;
  }

  function getNextButtonText() {
    const stepperUtils = new StepperUtils(state!);
    const shift = stepperUtils.getNextStepShift('forwards');

    if (shift >= items.length) {
      return 'activity_navigation:done';
    }

    return isLastStep
      ? 'activity_navigation:done'
      : canSkip
      ? 'activity_navigation:skip'
      : 'activity_navigation:next';
  }

  return {
    isTutorialStep,
    isFirstStep,
    isLastStep,
    isConditionalLogicItem,

    canSkip,
    canMoveNext,
    canMoveBack,
    canReset,

    showWatermark,
    showTopNavigation,
    showBottomNavigation,

    isValid,
    getNextButtonText,
  };
}

export default useActivityStepper;

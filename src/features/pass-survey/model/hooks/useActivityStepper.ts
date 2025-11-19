import { onIncorrectAnswerGiven } from '../../lib/alerts';
import { ActivityState } from '../../lib/hooks/useActivityStorageRecord';
import { ActivityItemType } from '../../lib/types/payload';
import { AnswerValidator } from '../AnswerValidator';

const ConditionalLogicItems: ActivityItemType[] = [
  'Radio',
  'Checkbox',
  'Slider',
  'NumberSelect',
  'Date',
  'Time',
  'TimeRange',
];

export function useActivityStepper(state: ActivityState | undefined) {
  const answerValidator = AnswerValidator(state);
  const step = state?.step ?? 0;
  const items = state?.items ?? [];
  const answers = state?.answers ?? {};

  const currentPipelineItem = state?.items[step];

  const currentType =
    typeof currentPipelineItem?.type === 'string'
      ? currentPipelineItem?.type.trim().toLowerCase()
      : undefined;

  const isTutorialStep = currentType === 'tutorial';
  const isAbTestStep = currentType === 'abtest';
  const isMessageStep = currentType === 'message';
  const isSplashStep = currentType === 'splash';
  const isFirstStep = step === 0;
  const isLastStep = items && step === items.length - 1;

  const additionalAnswerRequired =
    currentPipelineItem?.additionalText?.required;

  const hasAnswer =
    answers[step]?.answer !== undefined &&
    answers[step]?.answer !== null &&
    answers[step]?.answer !== '';
  const hasAdditionalAnswer =
    answers[step]?.additionalAnswer !== undefined &&
    answers[step]?.additionalAnswer !== null &&
    answers[step]?.additionalAnswer !== '';

  const canSkip =
    !!currentPipelineItem?.isSkippable && !hasAnswer && !isSplashStep;

  const canMoveNext =
    isTutorialStep ||
    isMessageStep ||
    isAbTestStep ||
    currentPipelineItem?.isSkippable ||
    (hasAnswer &&
      (!additionalAnswerRequired || hasAdditionalAnswer) &&
      answerValidator.isValidAnswer());

  const canMoveBack = currentPipelineItem?.isAbleToMoveBack;
  const canReset =
    currentPipelineItem?.canBeReset && (hasAnswer || hasAdditionalAnswer);
  const isUnityStep =
    currentPipelineItem?.isUnity ?? currentType === 'unity';
  const showTopNavigation =
    currentPipelineItem?.hasTopNavigation && !isUnityStep;
  const showBottomNavigation = !showTopNavigation && !isUnityStep;
  const showWatermark = !isSplashStep && !showTopNavigation && !isUnityStep;

  const isConditionalLogicItem = ConditionalLogicItems.includes(
    currentPipelineItem!?.type,
  );

  function isValid() {
    const valid = answerValidator.isCorrect();

    if (!valid) {
      onIncorrectAnswerGiven();
    }

    return valid;
  }

  function getNextButtonText() {
    return canSkip ? 'activity_navigation:skip' : 'activity_navigation:next';
  }

  const shouldPostProcessUserActions = isAbTestStep;

  return {
    isTutorialStep,
    isFirstStep,
    isLastStep,
    isConditionalLogicItem,
    shouldPostProcessUserActions,

    canSkip,
    canMoveNext,
    canMoveBack,
    canReset,

    showWatermark,
    showTopNavigation,
    showBottomNavigation,

    isUnityStep,
    isValid,
    getNextButtonText,
  };
}

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

  const isTutorialStep = currentPipelineItem?.type === 'Tutorial';
  const isAbTestStep = currentPipelineItem?.type === 'AbTest';
  const isMessageStep = currentPipelineItem?.type === 'Message';
  const isSplashStep = currentPipelineItem?.type === 'Splash';
  const isFirstStep = step === 0;
  const isLastStep = items && step === items.length - 1;

  const additionalAnswerRequired =
    currentPipelineItem?.additionalText?.required;

  const hasAnswer =
    answers[step]?.answer !== null && answers[step]?.answer !== '';
  const hasAdditionalAnswer =
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
  const showTopNavigation = currentPipelineItem?.hasTopNavigation;
  const showBottomNavigation = !showTopNavigation;
  const showWatermark = !isSplashStep && !showTopNavigation;

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

    isValid,
    getNextButtonText,
  };
}

import { ActivityState } from '../../lib';

function useActivityStepper(state: ActivityState | undefined) {
  const step = state?.step ?? 0;
  const items = state?.items ?? [];
  const answers = state?.answers ?? {};

  const currentPipelineItem = state?.items[step];

  const isTutorialStep = currentPipelineItem?.type === 'Tutorial';
  const isLastStep = items && step === items.length - 1;

  const canMoveNext =
    isTutorialStep || currentPipelineItem?.isSkippable || !!answers[step];
  const canMoveBack = currentPipelineItem?.isAbleToMoveToPrevious;
  const canReset = currentPipelineItem?.canBeReset;
  const showTopNavigation = currentPipelineItem?.hasTopNavigation;
  const showBottomNavigation = !showTopNavigation;

  return {
    isTutorialStep,
    isLastStep,

    canMoveNext,
    canMoveBack,
    canReset,

    showTopNavigation,
    showBottomNavigation,
  };
}

export default useActivityStepper;

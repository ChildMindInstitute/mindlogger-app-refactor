import { useRef } from 'react';

import { ActivityIndicator, Box, Center, Stepper, XStack } from '@shared/ui';

import ActivityItem from './ActivityItem';
import TutorialViewerItem, { TutorialViewerRef } from './TutorialViewerItem';
import { useActivityState, useActivityStepper } from '../model';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;

  onClose: () => void;
  onFinish: () => void;
};

function ActivityStepper({
  appletId,
  activityId,
  eventId,
  onClose,
  onFinish,
}: Props) {
  const {
    activityState,
    setStep: setCurrentStep,
    setAnswer,
  } = useActivityState({
    appletId,
    activityId,
    eventId,
  });

  const {
    isLastStep,
    isTutorialStep,

    canMoveNext,
    canMoveBack,
    canReset,

    showTopNavigation,
    showBottomNavigation,
  } = useActivityStepper(activityState);

  const currentStep = activityState?.step ?? 0;

  const tutorialViewerRef = useRef<TutorialViewerRef>(null);

  const onNext = (nextStep: number) => {
    setCurrentStep(nextStep);
  };
  const onBack = (nextStep: number) => {
    setCurrentStep(nextStep);
  };

  const onBeforeNext = (): number => {
    if (isTutorialStep) {
      const moved = tutorialViewerRef.current?.next();

      return moved ? 0 : 1;
    }

    return 1;
  };
  const onBeforeBack = (): number => {
    if (isTutorialStep) {
      const moved = tutorialViewerRef.current?.back();

      return moved ? 0 : 1;
    }

    return 1;
  };

  if (!activityState) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" color="$secondary" />
      </Center>
    );
  }

  return (
    <Box flex={1}>
      <Stepper
        stepsCount={activityState.items.length}
        startFrom={activityState.step}
        onNext={onNext}
        onBack={onBack}
        onBeforeNext={onBeforeNext}
        onBeforeBack={onBeforeBack}
        onStartReached={onClose}
        onEndReached={onFinish}
      >
        {showTopNavigation && (
          <Stepper.NavigationPanel position="absolute" mx={16}>
            {canMoveBack && <Stepper.BackButton isIcon />}
            {canReset && <Stepper.UndoButton isIcon />}
            {canMoveNext && <Stepper.NextButton isIcon />}
          </Stepper.NavigationPanel>
        )}

        <Stepper.ViewList
          renderItem={({ index }) => {
            const pipelineItem = activityState.items[index];

            return (
              <XStack flex={1} key={index} alignItems="center">
                <>
                  {pipelineItem.type === 'Tutorial' && (
                    <TutorialViewerItem
                      {...pipelineItem.payload}
                      ref={tutorialViewerRef}
                    />
                  )}

                  {pipelineItem.type !== 'Tutorial' && (
                    <ActivityItem
                      pipelineItem={pipelineItem}
                      onResponse={response => {
                        setAnswer(currentStep, response);
                      }}
                    />
                  )}
                </>
              </XStack>
            );
          }}
        />

        <Stepper.Progress />

        {showBottomNavigation && (
          <Stepper.NavigationPanel mt={16} minHeight={24}>
            {canMoveBack && <Stepper.BackButton>Return</Stepper.BackButton>}
            {canReset && <Stepper.UndoButton>Undo</Stepper.UndoButton>}

            {canMoveNext && (
              <Stepper.NextButton>
                {isLastStep ? 'Done' : 'Next'}
              </Stepper.NextButton>
            )}
          </Stepper.NavigationPanel>
        )}
      </Stepper>
    </Box>
  );
}

export default ActivityStepper;

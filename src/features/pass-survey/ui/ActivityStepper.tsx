import { useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityIndicator, Box, Center, Stepper, XStack } from '@shared/ui';

import ActivityItem from './ActivityItem';
import TutorialViewerItem, { TutorialViewerRef } from './TutorialViewerItem';
import {
  useActivityRecordInitialization,
  useActivityState,
  useActivityStepper,
} from '../model';

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
  const { t } = useTranslation();

  const { bottom } = useSafeAreaInsets();

  useActivityRecordInitialization({
    appletId,
    activityId,
    eventId,
  });

  const {
    activityStorageRecord,
    setStep: setCurrentStep,
    setAnswer,
    removeAnswer,
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
  } = useActivityStepper(activityStorageRecord);

  const currentStep = activityStorageRecord?.step ?? 0;

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

  const onUndo = () => {
    removeAnswer(currentStep);
  };

  if (!activityStorageRecord) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" color="$secondary" />
      </Center>
    );
  }

  return (
    <Box flex={1} pb={bottom}>
      <Stepper
        stepsCount={activityStorageRecord.items.length}
        startFrom={activityStorageRecord.step}
        onNext={onNext}
        onBack={onBack}
        onBeforeNext={onBeforeNext}
        onBeforeBack={onBeforeBack}
        onStartReached={onClose}
        onEndReached={onFinish}
        onUndo={onUndo}
      >
        {showTopNavigation && (
          <Stepper.NavigationPanel mx={16}>
            {canMoveBack && <Stepper.BackButton isIcon />}
            {canReset && <Stepper.UndoButton isIcon />}
            {canMoveNext && <Stepper.NextButton isIcon />}
          </Stepper.NavigationPanel>
        )}

        <Stepper.ViewList
          renderItem={({ index }) => {
            const pipelineItem = activityStorageRecord.items[index];
            const value = activityStorageRecord.answers[index];

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
                      value={value}
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
            {canMoveBack && (
              <Stepper.BackButton>
                {t('activity_navigation:back')}
              </Stepper.BackButton>
            )}

            {canReset && (
              <Stepper.UndoButton>
                {t('activity_navigation:undo')}
              </Stepper.UndoButton>
            )}

            {canMoveNext && (
              <Stepper.NextButton>
                {t(
                  isLastStep
                    ? 'activity_navigation:done'
                    : 'activity_navigation:next',
                )}
              </Stepper.NextButton>
            )}
          </Stepper.NavigationPanel>
        )}
      </Stepper>
    </Box>
  );
}

export default ActivityStepper;

import { useRef } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppletDetailsQuery } from '@app/entities/applet';
import { HourMinute } from '@app/shared/lib';
import { IS_ANDROID } from '@app/shared/lib';
import TimeRemaining from '@app/shared/ui/TimeRemaining';
import { ActivityIndicator, Box, Center, Stepper, XStack } from '@shared/ui';

import ActivityItem from './ActivityItem';
import TutorialViewerItem, { TutorialViewerRef } from './TutorialViewerItem';
import { useTextVariablesReplacer } from '../lib';
import {
  useActivityRecordInitialization,
  useActivityState,
  useActivityStepper,
  useIdleTimer,
} from '../model';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  idleTimer: HourMinute | null;
  entityStartedAt: number;
  timer: HourMinute | null;
  onClose: () => void;
  onFinish: () => void;
};

function ActivityStepper({
  appletId,
  activityId,
  eventId,
  idleTimer,
  timer,
  entityStartedAt,
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
    setAdditionalAnswer,
  } = useActivityState({
    appletId,
    activityId,
    eventId,
  });

  const { replaceTextVariables } = useTextVariablesReplacer({
    items: activityStorageRecord?.items,
    answers: activityStorageRecord?.answers,
  });

  const {
    isFirstStep,
    isLastStep,
    isTutorialStep,

    canSkip,
    canMoveNext,
    canMoveBack,
    canReset,

    showWatermark,
    showTopNavigation,
    showBottomNavigation,

    isValid,
  } = useActivityStepper(activityStorageRecord);

  const { restart: restartIdleTimer } = useIdleTimer({
    onFinish,
    hourMinute: idleTimer,
  });

  const { data: watermark } = useAppletDetailsQuery(appletId, {
    select: r => r.data.result.watermark,
  });

  const currentStep = activityStorageRecord?.step ?? 0;

  const nextButtonText = isLastStep
    ? 'activity_navigation:done'
    : canSkip
    ? 'activity_navigation:skip'
    : 'activity_navigation:next';

  const tutorialViewerRef = useRef<TutorialViewerRef | null>(null);

  const showTimeLeft = !!timer;

  const onNext = (nextStep: number) => {
    setCurrentStep(nextStep);
    restartIdleTimer();
  };

  const onBack = (nextStep: number) => {
    setCurrentStep(nextStep);
    restartIdleTimer();
  };

  const onBeforeNext = (): number => {
    if (!isValid()) {
      return 0;
    }

    if (isTutorialStep) {
      const moved = tutorialViewerRef.current?.next();

      !moved && restartIdleTimer();

      return moved ? 0 : 1;
    }

    return 1;
  };

  const onBeforeBack = (): number => {
    if (isTutorialStep) {
      const moved = tutorialViewerRef.current?.back();

      !moved && restartIdleTimer();

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
        onUndo={() => {
          onUndo();
          restartIdleTimer();
        }}
      >
        {showWatermark && watermark && (
          <CachedImage source={watermark} style={styles.watermark} />
        )}

        {showTimeLeft && (
          <TimeRemaining
            position="absolute"
            top={10}
            left={5}
            zIndex={1}
            entityStartedAt={entityStartedAt}
            timerSettings={timer}
          />
        )}

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
              <XStack
                flex={1}
                key={index}
                alignItems="center"
                onTouchStart={() => restartIdleTimer()}
              >
                <>
                  {pipelineItem.type === 'Tutorial' && (
                    <TutorialViewerItem
                      {...pipelineItem.payload}
                      ref={tutorialViewerRef}
                    />
                  )}

                  {pipelineItem.type !== 'Tutorial' && (
                    // @ts-ignore
                    // TODO
                    // pipelineItem.type cannot be accepted as a valid type for some reason.
                    <ActivityItem
                      type={pipelineItem.type}
                      value={value}
                      pipelineItem={pipelineItem}
                      timerSettings={timer}
                      entityStartedAt={entityStartedAt}
                      onResponse={response => {
                        setAnswer(currentStep, response);
                      }}
                      onAdditionalResponse={response => {
                        setAdditionalAnswer(currentStep, response);
                      }}
                      textVariableReplacer={replaceTextVariables}
                    />
                  )}
                </>
              </XStack>
            );
          }}
        />

        <Stepper.Progress />

        {showBottomNavigation && (
          <Stepper.NavigationPanel
            mt={16}
            minHeight={24}
            mb={IS_ANDROID ? 16 : 0}
          >
            {canMoveBack && (
              <Stepper.BackButton>
                {t(
                  isFirstStep
                    ? 'activity_navigation:return'
                    : 'activity_navigation:back',
                )}
              </Stepper.BackButton>
            )}

            {canReset && (
              <Stepper.UndoButton>
                {t('activity_navigation:undo')}
              </Stepper.UndoButton>
            )}

            {canMoveNext && (
              <Stepper.NextButton>{t(nextButtonText)}</Stepper.NextButton>
            )}
          </Stepper.NavigationPanel>
        )}
      </Stepper>
    </Box>
  );
}

const styles = StyleSheet.create({
  watermark: {
    height: 65,
    width: 65,
    position: 'absolute',
    top: 0,
    left: 15,
    resizeMode: 'contain',
    zIndex: 1,
  },
});

export default ActivityStepper;

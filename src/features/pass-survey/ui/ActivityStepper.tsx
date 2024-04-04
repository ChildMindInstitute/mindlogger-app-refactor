import { useContext, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppletDetailsQuery } from '@app/entities/applet';
import { HourMinute } from '@app/shared/lib';
import TimeRemaining from '@app/shared/ui/TimeRemaining';
import { AbTestResult } from '@entities/abTrail';
import {
  ActivityIndicator,
  Box,
  Center,
  StatusBar,
  Stepper,
  XStack,
} from '@shared/ui';

import ActivityItem from './ActivityItem';
import TutorialViewerItem, { TutorialViewerRef } from './TutorialViewerItem';
import {
  ActivityIdentityContext,
  fetchSkipActivityUserConfirmation,
  FlankerResponse,
  SkipService,
  useTextVariablesReplacer,
} from '../lib';
import { useActivityState, useActivityStepper, useIdleTimer } from '../model';
import { evaluateFlankerNextStep } from '../model/flankerNextStepEvaluator';

type Props = {
  idleTimer: HourMinute | null;
  entityStartedAt: number;
  timer: HourMinute | null;
  onClose: (reason: 'regular' | 'click-on-return') => void;
  onFinish: (reason: 'regular' | 'idle') => void;
};

function ActivityStepper({
  idleTimer,
  timer,
  entityStartedAt,
  onClose,
  onFinish,
}: Props) {
  const { t } = useTranslation();

  const { bottom } = useSafeAreaInsets();

  const { appletId, activityId, eventId, order } = useContext(
    ActivityIdentityContext,
  );

  const {
    activityStorageRecord,
    userActionCreator,
    trackUserAction,
    setStep: setCurrentStep,
    setAnswer,
    undoAnswer,
    setAdditionalAnswer,
    removeTimer,
    setContext,
    iterateWithConditionalLogic,
    getNextStepShift,
    getPreviousStepShift,
  } = useActivityState({
    appletId,
    activityId,
    eventId,
    order,
  });

  const skipService = new SkipService({
    onSkip: () =>
      trackUserAction(userActionCreator.saveAndProceedPopupConfirm()),
    onProceed: () =>
      trackUserAction(userActionCreator.saveAndProceedPopupCancel()),
  });

  const { replaceTextVariables } = useTextVariablesReplacer({
    items: activityStorageRecord?.items,
    answers: activityStorageRecord?.answers,
    activityId,
    appletId,
  });

  const {
    isFirstStep,
    isTutorialStep,
    isConditionalLogicItem,
    shouldSkipNextUserAction,

    canMoveNext,
    canMoveBack,
    canReset,
    canSkip,

    showWatermark,
    showTopNavigation,
    showBottomNavigation,

    isValid,
    getNextButtonText,
  } = useActivityStepper(activityStorageRecord);

  const { restart: restartIdleTimer } = useIdleTimer({
    onFinish: () => onFinish('idle'),
    hourMinute: idleTimer,
  });

  const { data: watermark } = useAppletDetailsQuery(appletId, {
    select: r => r.data.result.watermark,
  });

  const currentStep = activityStorageRecord?.step ?? 0;

  const nextButtonText = getNextButtonText();

  const getAccessibilityLabel = (text: string): string | null => {
    switch (text) {
      case 'activity_navigation:done':
        return 'done-button';
      case 'activity_navigation:skip':
        return 'skip-button';
      case 'activity_navigation:next':
        return 'next-button';
      default:
        return null;
    }
  };

  const tutorialViewerRef = useRef<TutorialViewerRef | null>(null);

  const showTimeLeft = !!timer;

  const onNext = (nextStep: number, isForced: boolean) => {
    removeTimer(currentStep);
    restartIdleTimer();
    setCurrentStep(nextStep);

    if (isForced) {
      return;
    }

    if (canSkip) {
      trackUserAction(userActionCreator.skip());
    } else if (!shouldSkipNextUserAction) {
      trackUserAction(userActionCreator.next());
    }
  };

  const onBack = (nextStep: number) => {
    removeTimer(currentStep);
    restartIdleTimer();
    setCurrentStep(nextStep);
    trackUserAction(userActionCreator.back());
  };

  const onBeforeNext = async (): Promise<number> => {
    if (!isValid()) {
      return 0;
    }

    if (isTutorialStep) {
      const moved = tutorialViewerRef.current?.next();

      moved && trackUserAction(userActionCreator.next());

      !moved && restartIdleTimer();

      return moved ? 0 : 1;
    }

    const currentItem = activityStorageRecord!.items[currentStep];

    if (currentItem.type === 'Flanker') {
      const stepAnswers = activityStorageRecord?.answers[currentStep];

      const nextStepIndex = evaluateFlankerNextStep(
        (stepAnswers?.answer as FlankerResponse) ?? null,
        currentStep,
        activityStorageRecord!.items,
      );

      return nextStepIndex === null ? 1 : nextStepIndex - currentStep;
    }

    if (skipService.isSkippableItem(currentItem.type)) {
      const stepAnswer = activityStorageRecord?.answers[currentStep]?.answer as
        | AbTestResult
        | undefined;

      const roundCompleted =
        stepAnswer && stepAnswer.currentIndex === stepAnswer.maximumIndex;

      if (roundCompleted) {
        return 1;
      }

      trackUserAction(userActionCreator.next());
      const shouldSkipRound = await fetchSkipActivityUserConfirmation();

      if (shouldSkipRound) {
        skipService.onSkip();
        return 1;
      } else {
        skipService.onProceed();
        return 0;
      }
    }

    if (isConditionalLogicItem) {
      iterateWithConditionalLogic(currentStep + 1);
    }

    return getNextStepShift();
  };

  const onBeforeBack = (): number => {
    if (isTutorialStep) {
      const moved = tutorialViewerRef.current?.back();

      !moved && restartIdleTimer();

      return moved ? 0 : 1;
    }

    return getPreviousStepShift();
  };

  const onUndo = () => {
    undoAnswer(currentStep);
    restartIdleTimer();
  };

  const onStartReached = () => {
    onClose('click-on-return');
  };

  const onEndReached = (isForced: boolean) => {
    if (!isForced) {
      trackUserAction(userActionCreator.done());
    }
    onFinish('regular');
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
      <StatusBar hidden />

      <Stepper
        stepsCount={activityStorageRecord.items.length}
        startFrom={activityStorageRecord.step}
        onNext={onNext}
        onBack={onBack}
        onBeforeNext={onBeforeNext}
        onBeforeBack={onBeforeBack}
        onStartReached={onStartReached}
        onEndReached={onEndReached}
        onUndo={onUndo}
      >
        {showWatermark && watermark && (
          <CachedImage
            source={watermark}
            style={styles.watermark}
            accessibilityLabel="watermark-image"
          />
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

            {canMoveNext && (
              <Stepper.NextButton
                accessibilityLabel={getAccessibilityLabel(nextButtonText)}
                isIcon
              />
            )}
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
                      onResponse={response => {
                        setAnswer(currentStep, response);
                      }}
                      onAdditionalResponse={response => {
                        setAdditionalAnswer(currentStep, response);
                      }}
                      textVariableReplacer={replaceTextVariables}
                      onContextChange={setContext}
                      context={activityStorageRecord?.context}
                    />
                  )}
                </>
              </XStack>
            );
          }}
        />

        <Stepper.Progress />

        {showBottomNavigation && (
          <Stepper.NavigationPanel mt={18} minHeight={27} mb={bottom ? 0 : 16}>
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
              <Stepper.NextButton
                accessibilityLabel={getAccessibilityLabel(nextButtonText)}
              >
                {t(nextButtonText)}
              </Stepper.NextButton>
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

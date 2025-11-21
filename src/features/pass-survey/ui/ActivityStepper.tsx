import { useContext, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useAppletDetailsQuery } from '@app/entities/applet/api/hooks/useAppletDetailsQuery';
import { useActiveAssessmentLink } from '@app/screens/model/hooks/useActiveAssessmentLink';
import { HourMinute } from '@app/shared/lib/types/dateTime';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { Spinner } from '@app/shared/ui/Spinner';
import {
  OnBeforeBackResult,
  OnBeforeNextResult,
  Stepper,
  StepperPayload,
} from '@app/shared/ui/Stepper';
import { TimeRemaining } from '@app/shared/ui/TimeRemaining';

import { ActivityItem } from './ActivityItem';
import { Header } from './Header';
import { ProgressWithTimer } from './ProgressWithTimer';
import { TutorialViewerItem, TutorialViewerRef } from './TutorialViewerItem';
import { fetchSkipActivityUserConfirmation } from '../lib/alerts';
import { ActivityIdentityContext } from '../lib/contexts/ActivityIdentityContext';
import { useTextVariablesReplacer } from '../lib/hooks/useTextVariablesReplacer';
import { SkipService } from '../lib/services/SkipService';
import { FlankerResponse } from '../lib/types/payload';
import { evaluateFlankerNextStep } from '../model/flankerNextStepEvaluator';
import { useActivityState } from '../model/hooks/useActivityState';
import { useActivityStepper } from '../model/hooks/useActivityStepper';
import { useIdleTimer } from '../model/hooks/useIdleTimer';
import { useSubSteps } from '../model/hooks/useSubSteps';

type Props = {
  idleTimer: HourMinute | null;
  entityStartedAt: number;
  timer: HourMinute | null;
  onClose: (reason: 'regular' | 'click-on-return') => void;
  onFinish: (reason: 'regular' | 'idle') => void;
  flowId?: string;
  targetSubjectId: string | null;
};

export function ActivityStepper({
  idleTimer,
  timer,
  entityStartedAt,
  onClose,
  onFinish,
  flowId,
}: Props) {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();

  const [timerHeight, setTimerHeight] = useState(0);
  const [showTimeLeft, setShowTimeLeft] = useState(!!timer);

  // This hook handles specific logic for resuming an active assessment when called via the
  // `active-assessment` deep link. It must be called here, within the context of both the
  // `InProgressActivity` screen and the `ActivityIdentityContext`.
  useActiveAssessmentLink();

  const {
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
    activityName,
  } = useContext(ActivityIdentityContext);

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
    postProcessUserActionsForCurrentItem,
    setSubStep,
  } = useActivityState({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  });

  const skipService = new SkipService({
    onSkip: () =>
      trackUserAction(userActionCreator.saveAndProceedPopupConfirm()),
    onProceed: () =>
      trackUserAction(userActionCreator.saveAndProceedPopupCancel()),
  });

  const { replaceTextVariables } = useTextVariablesReplacer({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    items: activityStorageRecord?.items,
    answers: activityStorageRecord?.answers,
  });

  const {
    isFirstStep,
    isTutorialStep,
    isConditionalLogicItem,
    shouldPostProcessUserActions,

    canMoveNext,
    canMoveBack,
    canReset,
    canSkip,

    showWatermark,
    showTopNavigation,
    showBottomNavigation,

    isUnityStep,
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
  const currentPipelineItem = activityStorageRecord?.items?.[currentStep];

  const {
    hasNextSubStep,
    hasPrevSubStep,
    handleSubmitSubStep,
    handleNextSubStep,
    handlePrevSubStep,
    nextButtonText: subStepNextButtonText,
  } = useSubSteps({
    itemStep: currentStep,
    item: currentPipelineItem,
    answer: activityStorageRecord?.answers?.[currentStep],
    setSubStep: (subStep: number) => {
      setSubStep(currentStep, subStep);
    },
  });

  const nextButtonText = subStepNextButtonText ?? getNextButtonText();

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

  const onNext = (
    nextStep: number,
    isForced: boolean,
    payload?: StepperPayload,
  ) => {
    const { shouldIgnoreUserActionTrack = false } = payload || {};

    removeTimer(currentStep);
    restartIdleTimer();
    setCurrentStep(nextStep);

    if (isForced) {
      return;
    }

    if (canSkip) {
      trackUserAction(userActionCreator.skip());
    } else if (!shouldIgnoreUserActionTrack) {
      trackUserAction(userActionCreator.next());
    }
  };

  const onBack = (nextStep: number) => {
    removeTimer(currentStep);
    restartIdleTimer();
    setCurrentStep(nextStep);
    trackUserAction(userActionCreator.back());
  };

  const onBeforeNext = async (): OnBeforeNextResult => {
    if (!isValid()) {
      return { stepShift: 0 };
    }

    handleSubmitSubStep();

    // If subSteps is supported and there are more subSteps to go through, go to the next subStep
    if (hasNextSubStep) {
      handleNextSubStep();
      restartIdleTimer();
      trackUserAction(userActionCreator.next());

      return { stepShift: null };
    }

    // Otherwise, proceed to the next step as normal

    if (isTutorialStep) {
      const moved = tutorialViewerRef.current?.next();

      moved && trackUserAction(userActionCreator.next());

      !moved && restartIdleTimer();

      return moved ? { stepShift: 0 } : { stepShift: 1 };
    }

    const currentItem = activityStorageRecord!.items[currentStep];

    if (currentItem.type === 'Flanker') {
      const stepAnswers = activityStorageRecord?.answers[currentStep];

      const nextStepIndex = evaluateFlankerNextStep(
        (stepAnswers?.answer as FlankerResponse) ?? null,
        currentStep,
        activityStorageRecord!.items,
      );

      return nextStepIndex === null
        ? { stepShift: 1 }
        : { stepShift: nextStepIndex - currentStep };
    }

    if (
      skipService.canSkip(
        currentItem.type,
        activityStorageRecord?.answers[currentStep],
      )
    ) {
      trackUserAction(userActionCreator.next());
      const shouldSkipRound = await fetchSkipActivityUserConfirmation();

      if (shouldSkipRound) {
        skipService.skip();
        return {
          stepShift: 1,
          payload: {
            shouldIgnoreUserActionTrack: true,
          },
        };
      } else {
        skipService.proceed();
        return { stepShift: 0 };
      }
    }

    if (isConditionalLogicItem) {
      iterateWithConditionalLogic(currentStep + 1);
    }

    return { stepShift: getNextStepShift() };
  };

  const onBeforeBack = (): OnBeforeBackResult => {
    // If subSteps is supported and we're not at the first subStep, go to the previous subStep
    if (hasPrevSubStep) {
      handlePrevSubStep();
      restartIdleTimer();
      trackUserAction(userActionCreator.back());

      return { stepShift: null };
    }

    // Otherwise, go to the previous step as normal

    if (isTutorialStep) {
      const moved = tutorialViewerRef.current?.back();

      !moved && restartIdleTimer();

      return { stepShift: moved ? 0 : 1 };
    }

    return { stepShift: getPreviousStepShift() };
  };

  const onUndo = () => {
    undoAnswer(currentStep);
    restartIdleTimer();
  };

  const onStartReached = () => {
    onClose('click-on-return');
  };

  const onEndReached = (isForced: boolean, payload?: StepperPayload) => {
    const { shouldIgnoreUserActionTrack = false } = payload || {};

    if (!isForced && !shouldIgnoreUserActionTrack) {
      trackUserAction(userActionCreator.done());
    }
    onFinish('regular');
  };

  if (!activityStorageRecord) {
    return <Spinner withOverlay />;
  }

  const safeAreaEdges = isUnityStep ? [] : ['bottom' as const];

  return (
    <Box flex={1}>
      {showTimeLeft && !isUnityStep && (
        <TimeRemaining
          ml={16}
          mt={top === 0 ? 12 : 0}
          zIndex={2}
          entityStartedAt={entityStartedAt}
          timerSettings={timer as HourMinute}
          clockIconShown
          opacity={timerHeight ? 1 : 0}
          onTimeElapsed={() => setShowTimeLeft(false)}
          onLayout={e => {
            setTimerHeight(e.nativeEvent.layout.height);
          }}
        />
      )}
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
        <SafeAreaView
          style={styles.safeAreaContainer}
          edges={safeAreaEdges}
          mode="margin"
        >
          {!isUnityStep && (
            <Header
              showWatermark={showWatermark}
              watermark={watermark}
              activityName={activityName}
              flowId={flowId}
              eventId={eventId}
              appletId={appletId}
              targetSubjectId={targetSubjectId}
            />
          )}
          {showTopNavigation && (
            <Stepper.NavigationPanel px={16}>
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

          <Box flex={1}>
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
                            if (shouldPostProcessUserActions) {
                              postProcessUserActionsForCurrentItem();
                            }
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
          </Box>

          {!isUnityStep && (
            <YStack
              borderTopColor="$surface_variant"
              borderTopWidth={1}
              gap={8}
            >
              <ProgressWithTimer
                key={currentPipelineItem?.id}
                duration={currentPipelineItem?.timer}
              />

              {showBottomNavigation && (
                <Stepper.NavigationPanel pt={20} px={16} pb={16} gap={8}>
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
            </YStack>
          )}
        </SafeAreaView>
      </Stepper>
    </Box>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
});

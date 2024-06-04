import { useContext, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppletDetailsQuery } from '@app/entities/applet';
import { colors, HourMinute, isIphoneX } from '@app/shared/lib';
import {
  ActivityIndicator,
  BackButton,
  Box,
  Center,
  ListSeparator,
  OnBeforeNextResult,
  StatusBar,
  Stepper,
  StepperPayload,
  Text,
  XStack,
} from '@shared/ui';
import TimeRemaining from '@shared/ui/TimeRemaining.tsx';

import ActivityItem from './ActivityItem';
import Header from './Header.tsx';
import HeaderProgress from './HeaderProgress.tsx';
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
  flowId?: string;
};

function ActivityStepper({
  idleTimer,
  timer,
  entityStartedAt,
  onClose,
  onFinish,
  flowId,
}: Props) {
  const { t } = useTranslation();

  const [timerHeight, setTimerHeight] = useState(0);

  const hasNotch = DeviceInfo.hasNotch();
  const { top: safeAreaTop, bottom } = useSafeAreaInsets();

  const { appletId, activityId, eventId, order, activityName } = useContext(
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
    postProcessUserActionsForCurrentItem,
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
    shouldPostProcessUserActions,

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

  const isNotIPhoneX = !isIphoneX();

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

  const timerMarginTop = hasNotch ? (safeAreaTop - timerHeight) / 2 : 16;

  const headerMarginTop = safeAreaTop > 10 ? safeAreaTop : safeAreaTop + 32;

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

  const onEndReached = (isForced: boolean, payload?: StepperPayload) => {
    const { shouldIgnoreUserActionTrack = false } = payload || {};

    if (!isForced && !shouldIgnoreUserActionTrack) {
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
      <StatusBar hidden={showTimeLeft} />

      {showTimeLeft && (
        <TimeRemaining
          position="absolute"
          top={timerMarginTop}
          left={16}
          zIndex={1}
          entityStartedAt={entityStartedAt}
          timerSettings={timer}
          clockIconShown={isNotIPhoneX}
          opacity={timerHeight ? 1 : 0}
          onLayout={e => {
            if (!timerHeight) {
              setTimerHeight(e.nativeEvent.layout.height);
            }
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
        <Header mt={showTimeLeft ? headerMarginTop : safeAreaTop} p={10}>
          {showWatermark && watermark && (
            <Box style={styles.watermarkContainer}>
              <CachedImage
                source={watermark}
                style={styles.watermark}
                accessibilityLabel="watermark-image"
              />
            </Box>
          )}
          <Text fontSize={16} numberOfLines={2} marginRight={100}>
            {activityName}
          </Text>
          <XStack ml="auto">
            <BackButton accessibilityLabel="close-button">
              <Text color={colors.blue3}>{t('activity_navigation:exit')}</Text>
            </BackButton>
          </XStack>
        </Header>

        <HeaderProgress appletId={appletId} eventId={eventId} flowId={flowId} />
        <ListSeparator mt={10} bg={colors.lighterGrey7} />

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
    height: 36,
    width: 36,
    resizeMode: 'contain',
  },
  watermarkContainer: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    overflow: 'hidden',
    marginRight: 10,
  },
});

export default ActivityStepper;

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { EntityPath } from '@app/abstract/lib/types/entity';
import { EntityProgressionInProgress } from '@app/abstract/lib/types/entityProgress';
import { useInProgressRecord } from '@app/entities/applet/model/hooks/useInProgressRecord';
import { useScheduledEvent } from '@app/entities/event/model/hooks/useEvent';
import { ActivityTimerContext } from '@app/features/pass-survey/lib/contexts/ActivityTimerContext';

import { FlowElementSwitch } from './FlowElementSwitch';
import { TimeIsUpModal } from './TimeIsUpModal';
import { useActivityRecordsInitialization } from '../model/hooks/useActivityRecordsInitialization';
import { useAvailabilityTimer } from '../model/hooks/useAvailabilityTimer';
import { useEventTimer } from '../model/hooks/useEventTimer';
import { useFlowRecordInitialization } from '../model/hooks/useFlowRecordInitialization';
import { useFlowState } from '../model/hooks/useFlowState';
import { useFlowStateActions } from '../model/hooks/useFlowStateActions';

type Props = {
  onClose: () => void;
} & EntityPath;

type TimerType = 'event' | 'availability';

export function FlowSurvey({
  appletId,
  entityId,
  entityType,
  eventId,
  targetSubjectId,
  onClose,
}: Props) {
  const [timeIsUpModalVisible, setTimeIsUpModalVisible] = useState(false);
  const [autocompletionTimerType, setAutocompletionTimerType] = useState<
    TimerType | undefined
  >(undefined);

  const { step, pipeline, isTimerElapsed, interruptionStep } = useFlowState({
    appletId,
    eventId,
    flowId: entityType === 'flow' ? entityId : undefined,
    targetSubjectId,
  });

  const {
    next,
    skipToStep,
    back,
    idleTimeoutNext,
    completeByTimer,
    clearFlowStorageRecord,
    canBeCompletedByTimer,
  } = useFlowStateActions({
    appletId,
    eventId,
    flowId: entityType === 'flow' ? entityId : undefined,
    targetSubjectId,
  });

  // Screens inside the activity that need to react when time is up, e.g.
  // Unity (M2-10888).
  const timeIsUpListeners = useRef(new Set<() => void>()).current;

  // True while a screen like Unity is still saving its work after time is up.
  const [isWaiting, setWaiting] = useState(false);
  const [isOkTapped, setIsOkTapped] = useState(false);

  // Stable, so subscribers never re-render because of it.
  const activityTimer = useMemo(
    () => ({
      onTimeIsUp: (listener: () => void) => {
        timeIsUpListeners.add(listener);
        return () => {
          timeIsUpListeners.delete(listener);
        };
      },
      setWaiting,
    }),
    [timeIsUpListeners],
  );

  const onTimeIsUp = useCallback(
    (timerType: TimerType) => {
      if (!canBeCompletedByTimer()) {
        return;
      }
      setAutocompletionTimerType(timerType);
      setTimeIsUpModalVisible(true);
    },
    [
      setAutocompletionTimerType,
      setTimeIsUpModalVisible,
      canBeCompletedByTimer,
    ],
  );

  // Let subscribers like Unity know only once the popup is on screen, so it
  // covers whatever they show while wrapping up.
  const onTimeIsUpModalShow = useCallback(() => {
    timeIsUpListeners.forEach(listener => listener());
  }, [timeIsUpListeners]);

  const onSubmitTimeUpModal = useCallback(() => setIsOkTapped(true), []);

  // Submit once OK is tapped and nothing is still saving.
  useEffect(() => {
    if (isOkTapped && !isWaiting) {
      setIsOkTapped(false);
      setTimeIsUpModalVisible(false);
      completeByTimer(autocompletionTimerType!);
    }
  }, [isOkTapped, isWaiting, autocompletionTimerType, completeByTimer]);

  const event = useScheduledEvent({ appletId, eventId })!;

  const progression = useInProgressRecord({
    appletId,
    entityId,
    eventId,
    targetSubjectId,
  })!;

  const entityStartedAt = (progression as EntityProgressionInProgress)
    .startedAtTimestamp;

  useEventTimer({
    entityStartedAt,
    timerHourMinute: event.timers?.timer,
    onFinish: () => onTimeIsUp('event'),
  });

  useAvailabilityTimer({
    availableTo: (progression as EntityProgressionInProgress)
      .availableUntilTimestamp,
    onFinish: () => onTimeIsUp('availability'),
  });

  const flowPipelineItem = pipeline[step];

  const nextActivityName = useMemo(() => {
    for (let i = step + 1; i < pipeline.length; i++) {
      const item = pipeline[i];
      if (item.type === 'Stepper') {
        return item.payload.activityName;
      }
    }
    return undefined;
  }, [pipeline, step]);

  const skipToNextActivity = useCallback(() => {
    // Find the next Stepper in the pipeline, skipping Intermediate/Summary
    for (let i = step + 1; i < pipeline.length; i++) {
      if (pipeline[i].type === 'Stepper') {
        skipToStep(i);
        return;
      }
    }
    // No more activities — close the flow
    clearFlowStorageRecord();
    onClose();
  }, [step, pipeline, skipToStep, clearFlowStorageRecord, onClose]);

  function closeFlow() {
    clearFlowStorageRecord();
    onClose();
  }

  function complete(reason: 'regular' | 'idle' = 'regular') {
    const isLast = step === pipeline.length - 1;

    if (isLast) {
      closeFlow();
    } else if (reason === 'idle') {
      idleTimeoutNext();
    } else {
      next();
    }
  }

  useFlowRecordInitialization({
    appletId,
    eventId,
    entityId,
    entityType,
    targetSubjectId,
  });

  useActivityRecordsInitialization({
    appletId,
    eventId,
    entityId,
    entityType,
    targetSubjectId,
  });

  return (
    <ActivityTimerContext.Provider value={activityTimer}>
      {timeIsUpModalVisible && (
        <TimeIsUpModal
          onSubmit={onSubmitTimeUpModal}
          onShow={onTimeIsUpModalShow}
          isLoading={isOkTapped}
        />
      )}
      <FlowElementSwitch
        {...flowPipelineItem}
        event={event}
        entityStartedAt={entityStartedAt}
        isTimerElapsed={isTimerElapsed}
        interruptionStep={interruptionStep}
        onClose={closeFlow}
        onBack={back}
        onComplete={complete}
        flowId={entityType === 'flow' ? entityId : undefined}
        nextActivityName={nextActivityName}
        onSkipActivity={skipToNextActivity}
      />
    </ActivityTimerContext.Provider>
  );
}

import { useCallback, useState } from 'react';

import { EntityPath, EntityProgressionInProgress } from '@app/abstract/lib';
import { useInProgressRecord } from '@app/entities/applet/model';
import { EventModel } from '@app/entities/event';
import { TimeIsUpModal } from '@widgets/survey';

import FlowElementSwitch from './FlowElementSwitch';
import {
  useActivityRecordsInitialization,
  useFlowRecordInitialization,
  useFlowState,
  useFlowStateActions,
} from '../model';
import useAvailabilityTimer from '../model/hooks/useAvailabilityTimer';
import useEventTimer from '../model/hooks/useEventTimer';

type Props = {
  onClose: () => void;
} & EntityPath;

type TimerType = 'event' | 'availability';

function FlowSurvey({
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

  const onSubmitTimeUpModal = useCallback(() => {
    setTimeIsUpModalVisible(false);
    completeByTimer(autocompletionTimerType!);
  }, [autocompletionTimerType, completeByTimer]);

  const event = EventModel.useScheduledEvent({ appletId, eventId })!;

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
    <>
      {timeIsUpModalVisible && <TimeIsUpModal onSubmit={onSubmitTimeUpModal} />}
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
      />
    </>
  );
}

export default FlowSurvey;

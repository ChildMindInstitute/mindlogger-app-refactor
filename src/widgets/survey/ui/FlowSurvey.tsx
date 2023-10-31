import { EntityPath, StoreProgressPayload } from '@app/abstract/lib';
import { useInProgressRecord } from '@app/entities/applet/model';
import { ScheduleEvent } from '@app/entities/event';
import { useEventQuery } from '@app/entities/event/api';

import FlowElementSwitch from './FlowElementSwitch';
import {
  useActivityRecordsInitialization,
  useFlowRecordInitialization,
  useFlowState,
  useFlowStateActions,
} from '../model';
import useTimer from '../model/hooks/useTimer';

type Props = {
  onClose: () => void;
} & EntityPath;

function FlowSurvey({
  appletId,
  entityId,
  entityType,
  eventId,
  onClose,
}: Props) {
  const { step, pipeline, isTimerElapsed } = useFlowState({
    appletId,
    eventId,
    flowId: entityType === 'flow' ? entityId : undefined,
  });

  const {
    next,
    back,
    idleTimeoutNext,
    completeByTimer,
    clearFlowStorageRecord,
  } = useFlowStateActions({
    appletId,
    eventId,
    flowId: entityType === 'flow' ? entityId : undefined,
  });

  const event: ScheduleEvent = useEventQuery(appletId, eventId);

  const progressRecord: StoreProgressPayload = useInProgressRecord({
    appletId,
    entityId,
    eventId,
  })!;

  const entityStartedAt = progressRecord.startAt;

  useTimer({
    entityStartedAt,
    onFinish: completeByTimer,
    timerHourMinute: event.timers?.timer,
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
  });

  useActivityRecordsInitialization({
    appletId,
    eventId,
    entityId,
    entityType,
  });

  return (
    <FlowElementSwitch
      {...flowPipelineItem}
      event={event!}
      entityStartedAt={entityStartedAt}
      isTimerElapsed={isTimerElapsed}
      onClose={closeFlow}
      onBack={back}
      onComplete={complete}
    />
  );
}

export default FlowSurvey;

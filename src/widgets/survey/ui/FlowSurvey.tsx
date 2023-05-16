import {
  ActivityPipelineType,
  EntityPath,
  StoreProgressPayload,
} from '@app/abstract/lib';
import { useInProgressRecord } from '@app/entities/applet/model';
import { ScheduleEvent } from '@app/entities/event';
import { useEventQuery } from '@app/entities/event/api';

import FlowElementSwitch from './FlowElementSwitch';
import {
  useActivityRecordsInitialization,
  useFlowRecordInitialization,
  useFlowState,
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
  const {
    next,
    back,
    step,
    completeByTimer,
    pipeline,
    isTimerElapsed,
    clearFlowStorageRecord,
  } = useFlowState({
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
  const pipelineActivityOrder =
    progressRecord.type === ActivityPipelineType.Flow
      ? progressRecord.pipelineActivityOrder
      : 0;

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

  function complete() {
    const isLast = step === pipeline.length - 1;

    if (isLast) {
      closeFlow();
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
      pipelineActivityOrder={pipelineActivityOrder}
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

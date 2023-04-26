import { StoreProgressPayload } from '@app/abstract/lib';
import { useInProgressRecord } from '@app/entities/applet/model';
import { ScheduleEvent } from '@app/entities/event';
import { useEventQuery } from '@app/entities/event/api';

import FlowElementSwitch from './FlowElementSwitch';
import { useFlowRecordInitialization, useFlowState } from '../model';
import useTimer from '../model/hooks/useTimer';

type Props = {
  appletId: string;
  eventId: string;
  flowId?: string;
  activityId: string;
  onClose: () => void;
};

function FlowSurvey({ appletId, activityId, eventId, onClose, flowId }: Props) {
  const {
    next,
    back,
    step,
    completeByTimer,
    pipeline,
    clearFlowStorageRecord,
  } = useFlowState({
    appletId,
    eventId,
    flowId,
  });

  const event: ScheduleEvent = useEventQuery(appletId, eventId);

  const progressRecord: StoreProgressPayload = useInProgressRecord({
    appletId,
    entityId: flowId ?? activityId,
    eventId,
  })!;

  const entityStartedAt = progressRecord.startAt;

  useTimer({
    entityStartedAt,
    onFinish: completeByTimer,
    timerHourMinute: event.timers.timer,
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
    activityId,
    eventId,
    flowId,
  });

  return (
    <FlowElementSwitch
      {...flowPipelineItem}
      event={event!}
      entityStartedAt={entityStartedAt}
      onClose={closeFlow}
      onBack={back}
      onComplete={complete}
    />
  );
}

export default FlowSurvey;

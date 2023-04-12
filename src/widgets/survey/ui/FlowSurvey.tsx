import { StoreProgressPayload } from '@app/abstract/lib';
import { useInProgressRecord } from '@app/entities/applet/model';
import { ScheduleEvent } from '@app/entities/event';
import { useEventQuery } from '@app/entities/event/api';

import FlowElementSwitch from './FlowElementSwitch';
import { FinishReason, useFlowState } from '../model';
import useTimer from '../model/hooks/useTimer';

type Props = {
  appletId: string;
  eventId: string;
  flowId?: string;
  activityId: string;
  onClose: () => void;
};

function FlowSurvey({ appletId, activityId, eventId, onClose, flowId }: Props) {
  const { next, back, step, completeByTimer, isTimerElapsed, pipeline } =
    useFlowState({
      appletId,
      activityId,
      eventId,
      flowId,
    });

  const event: ScheduleEvent = useEventQuery(appletId, eventId);

  const progressRecord: StoreProgressPayload = useInProgressRecord({
    appletId,
    entityId: flowId ?? activityId,
    eventId,
  })!;

  useTimer({
    entityStartedAt: progressRecord.startAt,
    onFinish: completeByTimer,
    timerHourMinute: event.timers.timer,
  });

  const flowPipelineItem = pipeline[step];

  let finishReason: FinishReason | null = null;

  if (flowPipelineItem.type === 'Finish') {
    finishReason = isTimerElapsed ? 'time-is-up' : 'regular';
  }

  function complete() {
    const isLast = step === pipeline.length - 1;

    if (isLast) {
      onClose();
    } else {
      next();
    }
  }

  return (
    <FlowElementSwitch
      {...flowPipelineItem}
      finishReason={finishReason}
      event={event!}
      onClose={onClose}
      onBack={back}
      onComplete={complete}
    />
  );
}

export default FlowSurvey;

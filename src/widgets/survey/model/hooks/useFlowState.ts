import { useMemo, useState } from 'react';

import { useAppletDetailsQuery } from '@app/entities/applet';
import { mapAppletDetailsFromDto } from '@app/entities/applet/model';

import {
  buildActivityFlowPipeline,
  buildSingleActivityPipeline,
} from '../pipelineBuilder';

export type UseFlowStateArgs = {
  appletId: string;
  eventId: string;
  flowId?: string;
  activityId: string;
};

export function useFlowState({
  appletId,
  eventId,
  activityId,
  flowId,
}: UseFlowStateArgs) {
  const [step, setStep] = useState(0);
  const [isTimerElapsed, setIsTimerElapsed] = useState(false);

  const { data: applet } = useAppletDetailsQuery(appletId, {
    select: response => mapAppletDetailsFromDto(response.data.result),
  });

  const pipeline = useMemo(() => {
    if (!applet) {
      return [];
    }

    const isActivityFlow = !!flowId;

    if (!isActivityFlow) {
      return buildSingleActivityPipeline({ appletId, eventId, activityId });
    } else {
      const activityIds = applet.activityFlows.find(
        flow => flow.id === flowId,
      )?.activityIds;

      return buildActivityFlowPipeline({
        fromActivityId: activityId,
        activityIds: activityIds!,
        appletId,
        eventId,
        flowId,
      });
    }
  }, [activityId, applet, appletId, eventId, flowId]);

  const isLastStep = step === pipeline.length - 1;

  function next() {
    if (isLastStep) {
      return;
    }
    setStep(step + 1);
  }

  function back() {
    const currentItem = pipeline[step];

    if (currentItem.type === 'Intermediate') {
      setStep(step - 1);
    }
  }

  function completeByTimer() {
    if (isLastStep) {
      return;
    }
    setStep(pipeline.length - 1);
    setIsTimerElapsed(true);
  }

  return {
    step,
    next,
    back,
    completeByTimer,
    isTimerElapsed,
    pipeline,
  };
}

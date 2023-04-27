type FlowPipelineType = 'Stepper' | 'Intermediate' | 'Finish';

type FlowPipelineItemBase = {
  type: FlowPipelineType;
};

interface StepperPipelineItem extends FlowPipelineItemBase {
  type: 'Stepper';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
  };
}

interface IntermediatePipelineItem extends FlowPipelineItemBase {
  type: 'Intermediate';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId: string;
  };
}

export type FinishReason = 'time-is-up' | 'regular';

interface FinishPipelineItem extends FlowPipelineItemBase {
  type: 'Finish';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId?: string;
  };
}

export type FlowPipelineItem =
  | StepperPipelineItem
  | IntermediatePipelineItem
  | FinishPipelineItem;

type BuildPipelineArgs = {
  appletId: string;
  eventId: string;
  activityIds: string[];
  flowId: string;
  startFrom: number;
};

export function buildActivityFlowPipeline({
  appletId,
  eventId,
  flowId,
  activityIds,
  startFrom,
}: BuildPipelineArgs): FlowPipelineItem[] {
  const pipeline: FlowPipelineItem[] = [];

  for (let i = 0; i < activityIds.length; i++) {
    const activityId = activityIds[i];
    const isNotLast = i !== activityIds.length - 1;
    const payload = {
      activityId,
      appletId,
      eventId,
    };

    pipeline.push({
      type: 'Stepper',
      payload,
    });

    if (isNotLast) {
      pipeline.push({
        type: 'Intermediate',
        payload: {
          ...payload,
          flowId,
        },
      });
    } else {
      pipeline.push({
        type: 'Finish',
        payload: {
          ...payload,
          flowId,
        },
      });
    }
  }

  return pipeline.slice(startFrom);
}

type BuildSinglePipelineArgs = {
  appletId: string;
  eventId: string;
  activityId: string;
};

export function buildSingleActivityPipeline({
  appletId,
  eventId,
  activityId,
}: BuildSinglePipelineArgs): FlowPipelineItem[] {
  const pipeline: FlowPipelineItem[] = [
    {
      type: 'Stepper',
      payload: {
        appletId,
        eventId,
        activityId,
      },
    },
    {
      type: 'Finish',
      payload: {
        appletId,
        eventId,
        activityId,
      },
    },
  ];

  return pipeline;
}

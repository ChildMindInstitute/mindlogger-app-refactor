type FlowPipelineType = 'Stepper' | 'Intermediate' | 'Summary' | 'Finish';

type FlowPipelineItemBase = {
  type: FlowPipelineType;
};

type HasSummary = (activityId: string) => boolean;

interface StepperPipelineItem extends FlowPipelineItemBase {
  type: 'Stepper';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    order: number;
  };
}

interface IntermediatePipelineItem extends FlowPipelineItemBase {
  type: 'Intermediate';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId: string;
    order: number;
  };
}

export type FinishReason = 'time-is-up' | 'regular';

interface SummaryPipelineItem extends FlowPipelineItemBase {
  type: 'Summary';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId?: string;
    order: number;
  };
}

interface FinishPipelineItem extends FlowPipelineItemBase {
  type: 'Finish';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId?: string;
    order: number;
  };
}

export type FlowPipelineItem =
  | StepperPipelineItem
  | IntermediatePipelineItem
  | SummaryPipelineItem
  | FinishPipelineItem;

type BuildPipelineArgs = {
  appletId: string;
  eventId: string;
  activityIds: string[];
  flowId: string;
  startFrom: number;
  hasSummary: HasSummary;
};

export function buildActivityFlowPipeline({
  appletId,
  eventId,
  flowId,
  activityIds,
  startFrom,
  hasSummary,
}: BuildPipelineArgs): FlowPipelineItem[] {
  const pipeline: FlowPipelineItem[] = [];

  const showSummary = activityIds.some((id) => hasSummary(id));

  for (let i = 0; i < activityIds.length; i++) {
    const activityId = activityIds[i];

    const isNotLast = i !== activityIds.length - 1;
    const payload = {
      activityId,
      appletId,
      eventId,
      order: i,
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
      if (showSummary) {
        pipeline.push({
          type: 'Summary',
          payload: {
            ...payload,
            flowId,
          },
        });
      }

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
  hasSummary: HasSummary;
};

export function buildSingleActivityPipeline({
  appletId,
  eventId,
  activityId,
  hasSummary,
}: BuildSinglePipelineArgs): FlowPipelineItem[] {
  const pipeline: FlowPipelineItem[] = [];

  pipeline.push({
    type: 'Stepper',
    payload: {
      appletId,
      eventId,
      activityId,
      order: 0,
    },
  });

  if (hasSummary(activityId)) {
    pipeline.push({
      type: 'Summary',
      payload: {
        appletId,
        eventId,
        activityId,
        order: 0,
      },
    });
  }

  pipeline.push({
    type: 'Finish',
    payload: {
      appletId,
      eventId,
      activityId,
      order: 0,
    },
  });

  return pipeline;
}

import { FlowProgressActivity } from '@app/abstract/lib';

type FlowPipelineType = 'Stepper' | 'Intermediate' | 'Summary' | 'Finish';

type FlowPipelineItemBase = {
  type: FlowPipelineType;
};

type HasSummary = (activityId: string) => boolean;

export interface StepperPipelineItem extends FlowPipelineItemBase {
  type: 'Stepper';
  payload: {
    appletId: string;
    activityId: string;
    activityName: string;
    activityDescription: string;
    activityImage: string | null;
    eventId: string;
    flowId?: string;
    order: number;
  };
}

interface IntermediatePipelineItem extends FlowPipelineItemBase {
  type: 'Intermediate';
  payload: {
    appletId: string;
    activityId: string;
    activityName: string;
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
    activityName: string;
    eventId: string;
    flowId?: string;
    order: number;
  };
}

export interface FinishPipelineItem extends FlowPipelineItemBase {
  type: 'Finish';
  payload: {
    appletId: string;
    activityId: string;
    activityName: string;
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
  activities: FlowProgressActivity[];
  flowId: string;
  startFrom: number;
  hasSummary: HasSummary;
};

export function buildActivityFlowPipeline({
  appletId,
  eventId,
  flowId,
  activities,
  startFrom,
  hasSummary,
}: BuildPipelineArgs): FlowPipelineItem[] {
  const pipeline: FlowPipelineItem[] = [];

  const showSummary = activities.some(x => hasSummary(x.id));

  for (let i = 0; i < activities.length; i++) {
    const activityId = activities[i].id;
    const isNotLast = i !== activities.length - 1;

    const payload = {
      activityId,
      activityName: activities[i].name,
      appletId,
      eventId,
      order: i,
    };

    pipeline.push({
      type: 'Stepper',
      payload: {
        ...payload,
        flowId,
        activityDescription: activities[i].description,
        activityImage: activities[i].image,
      },
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
  activity: FlowProgressActivity;
  hasSummary: HasSummary;
};

export function buildSingleActivityPipeline({
  appletId,
  eventId,
  activity,
  hasSummary,
}: BuildSinglePipelineArgs): FlowPipelineItem[] {
  const pipeline: FlowPipelineItem[] = [];

  pipeline.push({
    type: 'Stepper',
    payload: {
      appletId,
      eventId,
      activityId: activity.id,
      activityName: activity.name,
      activityDescription: activity.description,
      activityImage: activity.image,
      order: 0,
    },
  });

  if (hasSummary(activity.id)) {
    pipeline.push({
      type: 'Summary',
      payload: {
        appletId,
        eventId,
        activityId: activity.id,
        activityName: activity.name,
        order: 0,
      },
    });
  }

  pipeline.push({
    type: 'Finish',
    payload: {
      appletId,
      eventId,
      activityId: activity.id,
      activityName: activity.name,
      order: 0,
    },
  });

  return pipeline;
}

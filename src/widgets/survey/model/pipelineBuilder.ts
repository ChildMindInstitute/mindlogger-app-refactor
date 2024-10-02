import { FlowProgressActivity } from '@app/abstract/lib/types/entity';
import {
  BuildPipelineArgs,
  FlowPipelineItem,
  HasSummary,
} from '@widgets/survey/model/IPipelineBuilder.ts';

export function buildActivityFlowPipeline({
  appletId,
  eventId,
  flowId,
  targetSubjectId,
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
        targetSubjectId,
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
          targetSubjectId,
        },
      });
    } else {
      if (showSummary) {
        pipeline.push({
          type: 'Summary',
          payload: {
            ...payload,
            flowId,
            targetSubjectId,
          },
        });
      }

      pipeline.push({
        type: 'Finish',
        payload: {
          ...payload,
          flowId,
          targetSubjectId,
        },
      });
    }
  }

  return pipeline.slice(startFrom);
}

type BuildSinglePipelineArgs = {
  appletId: string;
  eventId: string;
  targetSubjectId: string | null;
  activity: FlowProgressActivity;
  hasSummary: HasSummary;
};

export function buildSingleActivityPipeline({
  appletId,
  eventId,
  targetSubjectId,
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
      targetSubjectId,
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
        targetSubjectId,
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
      targetSubjectId,
      order: 0,
    },
  });

  return pipeline;
}

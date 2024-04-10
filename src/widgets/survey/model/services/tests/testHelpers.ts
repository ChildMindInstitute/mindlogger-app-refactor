import { ActivityPipelineType, EntityPath } from '@app/abstract/lib';
import { NotCompletedEntity } from '@app/entities/applet/model/selectors';
import { FlowState } from '@app/widgets/survey';

export const getRegularProgressRecord = (
  path: EntityPath,
): NotCompletedEntity => {
  return {
    appletId: path.appletId,
    entityId: path.entityId,
    eventId: path.eventId,
    type: ActivityPipelineType.Regular,
    payload: {
      availableTo: null,
    } as any,
  };
};

export const getFlowProgressRecord = (path: EntityPath): NotCompletedEntity => {
  return {
    appletId: path.appletId,
    entityId: path.entityId,
    eventId: path.eventId,
    type: ActivityPipelineType.Flow,
    payload: {
      availableTo: null,
    } as any,
  };
};

export const getSingleActivityFlowState = (path: EntityPath): FlowState => {
  return {
    flowName: null,
    step: 0,
    scheduledDate: null,
    isCompletedDueToTimer: false,
    context: {},
    pipeline: [
      {
        type: 'Stepper',
        payload: {
          activityDescription: 'mock-activity-description',
          activityId: path.entityId,
          activityImage: null,
          activityName: 'mock-activity-name',
          appletId: path.appletId,
          eventId: path.eventId,
          order: 0,
        },
      },
      {
        type: 'Finish',
        payload: {
          activityId: path.entityId,
          activityName: 'mock-activity-name',
          appletId: path.appletId,
          eventId: path.eventId,
          order: 0,
        },
      },
    ],
  };
};

export const getMultipleActivityFlowState = (path: EntityPath): FlowState => {
  return {
    flowName: 'mock-flow-name',
    step: 0,
    scheduledDate: null,
    isCompletedDueToTimer: false,
    context: {},
    pipeline: [
      {
        type: 'Stepper',
        payload: {
          activityDescription: 'mock-activity-description-1',
          activityId: 'mock-activity-id-1',
          activityImage: null,
          activityName: 'mock-activity-name-1',
          appletId: path.appletId,
          eventId: path.eventId,
          order: 0,
        },
      },
      {
        type: 'Intermediate',
        payload: {
          flowId: path.entityId,
          activityId: 'mock-activity-id-1',
          activityName: 'mock-activity-name-1',
          appletId: path.appletId,
          eventId: path.eventId,
          order: 0,
        },
      },
      {
        type: 'Stepper',
        payload: {
          activityDescription: 'mock-activity-description-2',
          activityId: 'mock-activity-id-2',
          activityImage: null,
          activityName: 'mock-activity-name-2',
          appletId: path.appletId,
          eventId: path.eventId,
          order: 1,
        },
      },
      {
        type: 'Finish',
        payload: {
          flowId: path.entityId,
          activityId: 'mock-activity-id-2',
          activityName: 'mock-activity-name-2',
          appletId: path.appletId,
          eventId: path.eventId,
          order: 1,
        },
      },
    ],
  };
};

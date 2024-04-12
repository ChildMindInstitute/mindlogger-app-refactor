import { addMinutes } from 'date-fns';

import {
  ActivityPipelineType,
  EntityPath,
  StoreProgress,
} from '@app/abstract/lib';
import { NotCompletedEntity } from '@app/entities/applet/model/selectors';
import {
  ActivityState,
  Answers,
  PipelineItem,
  UserAction,
} from '@app/features/pass-survey';
import { CollectCompletionOutput, FlowState } from '@app/widgets/survey';

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

export const deleteLogAvailableTo = (
  collected: CollectCompletionOutput[],
): CollectCompletionOutput[] => {
  for (let item of collected) {
    delete item.logAvailableTo;
  }
  return collected;
};

export const getUserActionsMock = (answersMock: Answers): UserAction[] => {
  const userActionsMock: UserAction[] = [
    {
      type: 'SET_ANSWER',
      payload: {
        activityId: 'mock-activity-id-1',
        activityItemId: 'mock-slider-item-1',
        date: new Date(2023, 3, 5).getTime(),
        answer: {
          type: 'Slider',
          value: answersMock[0],
        },
      },
    },
    {
      type: 'NEXT',
      payload: {
        activityId: 'mock-activity-id-1',
        activityItemId: 'mock-slider-item-1',
        date: addMinutes(new Date(2023, 3, 5), 1).getTime(),
      },
    },
    {
      type: 'SET_ANSWER',
      payload: {
        activityId: 'mock-activity-id-1',
        activityItemId: 'mock-slider-item-2',
        date: addMinutes(new Date(2023, 3, 5), 2).getTime(),
        answer: {
          type: 'Slider',
          value: answersMock[1],
        },
      },
    },
    {
      type: 'DONE',
      payload: {
        activityId: 'mock-activity-id-1',
        activityItemId: 'mock-slider-item-2',
        date: addMinutes(new Date(2023, 3, 5), 3).getTime(),
      },
    },
  ];

  return userActionsMock;
};

export const getFlowProgressMock = (): StoreProgress => {
  const progress: StoreProgress = {
    'mock-applet-id-1': {
      'mock-flow-id-1': {
        'mock-event-id-1': {
          type: ActivityPipelineType.Flow,
          availableTo: null,
          startAt: 12367800000,
          endAt: null,
          currentActivityDescription: 'mock-activity-description-1',
          currentActivityId: 'mock-activity-id-1',
          currentActivityImage: null,
          currentActivityName: 'mock-activity-name-1',
          currentActivityStartAt: 12389100000,
          executionGroupKey: 'mock-flow-group-key-1',
          pipelineActivityOrder: 0,
          totalActivitiesInPipeline: 2,
        },
      },
    },
  };
  return progress;
};

export const getActivityRecordMockResult = (
  answersMock: Answers,
  userActionsMock: UserAction[],
  itemsMock: PipelineItem[],
): ActivityState | null => {
  return {
    answers: answersMock,
    actions: userActionsMock,
    appletVersion: 'applet-version-mock-1',
    context: {},
    hasSummary: false,
    scoreSettings: [],
    timers: {},
    step: 0,
    items: itemsMock,
  };
};

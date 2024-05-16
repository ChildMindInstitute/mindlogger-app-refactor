import {
  ActivityPipelineType,
  EntityPath,
  EntityType,
  StoreProgress,
} from '@app/abstract/lib';
import { NotCompletedEntity } from '@app/entities/applet/model/selectors';
import {
  ActivityState,
  Answer,
  Answers,
  PipelineItem,
  UserAction,
} from '@app/features/pass-survey';
import { AnswerDto, SliderAnswerDto } from '@app/shared/api';
import {
  CollectCompletionOutput,
  ConstructInput,
  FlowState,
} from '@app/widgets/survey';
import * as dateTimeUtils from '@shared/lib/utils/dateTime';

import * as metaHelpers from '../../../lib/metaHelpers';
import * as storageHelpers from '../../../lib/storageHelpers';
import * as mappers from '../../mappers';
import * as operations from '../../operations';

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
    interruptionStep: null,
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
    interruptionStep: null,
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
  for (const item of collected) {
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
        date: 5789000001,
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
        date: 5789050002,
      },
    },
    {
      type: 'SET_ANSWER',
      payload: {
        activityId: 'mock-activity-id-1',
        activityItemId: 'mock-slider-item-2',
        date: 5789300003,
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
        date: 5789900004,
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
          entityName: 'mock-entity-name',
        },
      },
    },
  };
  return progress;
};

export const getActivityProgressMock = (): StoreProgress => {
  const progress: StoreProgress = {
    'mock-applet-id-1': {
      'mock-activity-id-1': {
        'mock-event-id-1': {
          type: ActivityPipelineType.Regular,
          availableTo: null,
          startAt: 12367800000,
          endAt: null,
          entityName: 'mock-entity-name',
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
): ActivityState => {
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

function convertToSliderAnswerMock(answer: Answer): AnswerDto {
  return {
    value: answer.answer as SliderAnswerDto,
  };
}

export const mockConstructionServiceExternals = (mockNowDate: Date) => {
  const getItemIdsMock = jest
    .spyOn(operations, 'getItemIds')
    .mockReturnValue(['mock-slider-id-1', 'mock-slider-id-2']);

  const mockFillNullsForHiddenItems = jest
    .spyOn(operations, 'fillNullsForHiddenItems')
    .mockImplementation((itemIds: string[], answers: AnswerDto[], _: any) => {
      return { answers, itemIds };
    });

  const getFlowRecordMock = jest
    .spyOn(storageHelpers, 'getFlowRecord')
    .mockReturnValue({
      scheduledDate: 1245800000,
      flowName: null,
    } as FlowState);

  const getUserIdentifierMock = jest
    .spyOn(operations, 'getUserIdentifier')
    .mockReturnValue('mock-user-id-1');

  const mapAnswersToAlertsMock = jest
    .spyOn(mappers, 'mapAnswersToAlerts')
    .mockReturnValue([]);

  const getClientInformationMock = jest
    .spyOn(metaHelpers, 'getClientInformation')
    .mockReturnValue({
      appId: 'mock-app-name-1',
      appVersion: 'mock-app-version-1',
      width: 1347,
      height: 2358,
    });

  const clearActivityStorageRecordMock = jest
    .spyOn(storageHelpers, 'clearActivityStorageRecord')
    .mockReturnValue();

  const mapAnswersToDtoMock = jest
    .spyOn(mappers, 'mapAnswersToDto')
    .mockImplementation((_: any, answers: Answers) => {
      return [
        convertToSliderAnswerMock(answers[0]),
        convertToSliderAnswerMock(answers[1]),
      ];
    });

  jest.spyOn(dateTimeUtils, 'getNow').mockReturnValue(mockNowDate);

  jest.spyOn(dateTimeUtils, 'getTimezoneOffset').mockReturnValue(3);

  const createSvgFilesMock = jest
    .spyOn(operations, 'createSvgFiles')
    .mockResolvedValue([undefined]);

  const saveSummaryMock = jest.fn();

  return {
    getItemIdsMock,
    mockFillNullsForHiddenItems,
    getFlowRecordMock,
    getUserIdentifierMock,
    mapAnswersToAlertsMock,
    getClientInformationMock,
    clearActivityStorageRecordMock,
    mapAnswersToDtoMock,
    createSvgFilesMock,
    saveSummaryMock,
  };
};

export const createGetActivityRecordMock = (
  itemsMock: any,
  answersMock: any,
  hasSummary: boolean = false,
) => {
  const userActionsMock: UserAction[] = getUserActionsMock(answersMock);

  const activityRecord = getActivityRecordMockResult(
    answersMock,
    userActionsMock,
    itemsMock,
  );

  const getActivityRecordMock = jest
    .spyOn(storageHelpers, 'getActivityRecord')
    .mockReturnValue({ ...activityRecord, hasSummary });

  return getActivityRecordMock;
};

export const getInputsForIntermediate = (): ConstructInput => {
  return {
    completionType: 'intermediate',
    activityId: 'mock-activity-id-1',
    activityName: 'mock-activity-name-1',
    appletId: 'mock-applet-id-1',
    eventId: 'mock-event-id-1',
    flowId: 'mock-flow-id-1',
    order: 0,
    isAutocompletion: false,
  };
};

export const getInputsForFinish = (entityType: EntityType): ConstructInput => {
  return {
    completionType: 'finish',
    activityId: 'mock-activity-id-1',
    activityName: 'mock-activity-name-1',
    appletId: 'mock-applet-id-1',
    eventId: 'mock-event-id-1',
    flowId: entityType === 'flow' ? 'mock-flow-id-1' : undefined,
    order: 0,
    isAutocompletion: false,
  };
};

export const expectedUserActions = [
  {
    response: {
      value: 3,
    },
    screen: 'mock-activity-id-1/mock-slider-item-1',
    time: 5789000001,
    type: 'SET_ANSWER',
  },
  {
    screen: 'mock-activity-id-1/mock-slider-item-1',
    time: 5789050002,
    type: 'NEXT',
  },
  {
    response: {
      value: 8,
    },
    screen: 'mock-activity-id-1/mock-slider-item-2',
    time: 5789300003,
    type: 'SET_ANSWER',
  },
  {
    screen: 'mock-activity-id-1/mock-slider-item-2',
    time: 5789900004,
    type: 'DONE',
  },
];

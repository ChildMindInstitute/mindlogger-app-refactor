import { EntityPath, EntityType } from '@app/abstract/lib/types/entity';
import {
  EntityProgression,
  EntityProgressionCompleted,
  EntityProgressionInProgressActivityFlow,
} from '@app/abstract/lib/types/entityProgress';
import { IncompleteEntity } from '@app/entities/applet/model/selectors';
import {
  ActivityState,
  Answer,
  Answers,
} from '@app/features/pass-survey/lib/hooks/useActivityStorageRecord';
import { PipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { UserAction } from '@app/features/pass-survey/lib/types/userAction';
import {
  AnswerDto,
  SliderAnswerDto,
} from '@app/shared/api/services/IAnswerService';
import { FlowState } from '@app/widgets/survey/lib/useFlowStorageRecord';
import * as dateTimeUtils from '@shared/lib/utils/dateTime';
import { CollectCompletionOutput } from '@widgets/survey/model/services/ICollectCompletionsService';

import * as metaHelpers from '../../../lib/metaHelpers';
import * as storageHelpers from '../../../lib/storageHelpers';
import * as mappers from '../../mappers';
import * as operations from '../../operations';
import { ConstructInput } from '../ConstructCompletionsService';

export const getActivityIncompleteEntity = (
  path: EntityPath,
): IncompleteEntity => {
  return {
    appletId: path.appletId,
    entityType: 'activity',
    entityId: path.entityId,
    eventId: path.eventId,
    targetSubjectId: path.targetSubjectId,
    progression: {
      status: 'in-progress',
      appletId: path.appletId,
      entityType: 'activity',
      entityId: path.entityId,
      eventId: path.eventId,
      targetSubjectId: path.targetSubjectId,
      startedAtTimestamp: new Date().getTime(),
      availableUntilTimestamp: null,
      submitId: 'test-submit-id',
    },
  };
};

export const getActivityFlowIncompleteEntity = (
  path: EntityPath,
): IncompleteEntity<EntityProgressionInProgressActivityFlow> => {
  return {
    appletId: path.appletId,
    entityType: 'activityFlow',
    entityId: path.entityId,
    eventId: path.eventId,
    targetSubjectId: path.targetSubjectId,
    progression: {
      status: 'in-progress',
      appletId: path.appletId,
      entityType: 'activityFlow',
      entityId: path.entityId,
      eventId: path.eventId,
      targetSubjectId: path.targetSubjectId,
      startedAtTimestamp: new Date().getTime(),
      availableUntilTimestamp: null,
      pipelineActivityOrder: 0,
      totalActivitiesInPipeline: 1,
      currentActivityId: 'activity-1',
      currentActivityName: 'activity-name',
      currentActivityDescription: 'activity-desc',
      currentActivityImage: null,
      currentActivityStartAt: null,
      submitId: 'group-key',
    },
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
          targetSubjectId: path.targetSubjectId,
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
          targetSubjectId: path.targetSubjectId,
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
          targetSubjectId: path.targetSubjectId,
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
          targetSubjectId: path.targetSubjectId,
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
          targetSubjectId: path.targetSubjectId,
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
          targetSubjectId: path.targetSubjectId,
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

export const getFlowProgressionsMock = (): EntityProgression[] => {
  const progression: EntityProgression = {
    status: 'in-progress',
    appletId: 'mock-applet-id-1',
    entityType: 'activityFlow',
    entityId: 'mock-flow-id-1',
    eventId: 'mock-event-id-1',
    targetSubjectId: null,
    startedAtTimestamp: 12367800000,
    availableUntilTimestamp: null,
    currentActivityDescription: 'mock-activity-description-1',
    currentActivityId: 'mock-activity-id-1',
    currentActivityImage: null,
    currentActivityName: 'mock-activity-name-1',
    currentActivityStartAt: 12389100000,
    submitId: 'mock-flow-group-key-1',
    pipelineActivityOrder: 0,
    totalActivitiesInPipeline: 2,
  };

  (progression as never as EntityProgressionCompleted).endedAtTimestamp = null;

  return [progression];
};

export const getActivityProgressionsMock = (): EntityProgression[] => {
  const progression: EntityProgression = {
    status: 'in-progress',
    appletId: 'mock-applet-id-1',
    entityType: 'activity',
    entityId: 'mock-activity-id-1',
    eventId: 'mock-event-id-1',
    targetSubjectId: null,
    startedAtTimestamp: 12367800000,
    availableUntilTimestamp: null,
    submitId: 'mock-activity-group-key-1',
  };

  (progression as never as EntityProgressionCompleted).endedAtTimestamp = null;

  return [progression];
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
    targetSubjectId: null,
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
    targetSubjectId: null,
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

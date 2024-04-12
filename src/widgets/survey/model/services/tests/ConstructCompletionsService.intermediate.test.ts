import { StoreProgress } from '@app/abstract/lib';
import {
  Answer,
  Answers,
  PipelineItem,
  UserAction,
} from '@app/features/pass-survey';
import { getEmptySliderItem as getSliderItem } from '@app/features/pass-survey/model/tests/testHelpers';
import { AnswerDto, SliderAnswerDto } from '@app/shared/api';
import { FlowState } from '@app/widgets/survey/lib';
import * as dateTimeUtils from '@shared/lib/utils/dateTime';

import {
  getActivityRecordMockResult,
  getFlowProgressMock,
  getUserActionsMock,
} from './testHelpers';
import * as metaHelpers from '../../../lib/metaHelpers';
import * as storageHelpers from '../../../lib/storageHelpers';
import * as mappers from '../../mappers';
import * as operations from '../../operations';
import { ConstructCompletionsService } from '../ConstructCompletionsService';

jest.mock('@app/shared/lib/services/Logger', () => ({
  log: jest.fn(),
  info: jest.fn(),
}));

jest.mock('@app/features/pass-survey/model/ScoresExtractor', () => ({
  extract: jest
    .fn()
    .mockReturnValue([
      { name: 'mock-score-name-1', value: 125, flagged: true },
    ]),
}));

jest.mock('@app/features/pass-survey/model/AlertsExtractor', () => ({
  extractForSummary: jest.fn().mockReturnValue([
    {
      activityItemId: 'mock-activity-item-1',
      message: 'mock-message-1',
    },
  ]),
}));

function convertToSliderAnswerMock(answer: Answer): AnswerDto {
  return {
    value: answer.answer as SliderAnswerDto,
  };
}

describe('Test ConstructCompletionsService.constructForIntermediate', () => {
  const mockNowDate = new Date(2023, 3, 8, 15, 27);

  jest.spyOn(dateTimeUtils, 'getNow').mockReturnValue(mockNowDate);

  jest.spyOn(dateTimeUtils, 'getTimezoneOffset').mockReturnValue(3);

  const createSvgFilesMock = jest
    .spyOn(operations, 'createSvgFiles')
    .mockResolvedValue([]);

  const saveSummaryMock = jest.fn();

  const mapAnswersToDtoMock = jest
    .spyOn(mappers, 'mapAnswersToDto')
    .mockImplementation((_: any, answers: Answers) => {
      return [
        convertToSliderAnswerMock(answers[0]),
        convertToSliderAnswerMock(answers[1]),
      ];
    });

  const mapUserActionsToDtoMock = jest
    .spyOn(mappers, 'mapUserActionsToDto')
    .mockReturnValue([]);

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should push item to queue when hasSummary is false', async () => {
    const answersMock: Answers = {
      0: { answer: 3 },
      1: { answer: 8 },
    };

    const itemsMock: PipelineItem[] = [
      getSliderItem('mock-slider-item-1', 'mock-slider-id-1'),
      getSliderItem('mock-slider-item-2', 'mock-slider-id-2'),
    ];

    const userActionsMock: UserAction[] = getUserActionsMock(answersMock);

    const getActivityRecordMock = jest
      .spyOn(storageHelpers, 'getActivityRecord')
      .mockReturnValue(
        getActivityRecordMockResult(answersMock, userActionsMock, itemsMock),
      );

    const pushMock = jest.fn();

    const pushToQueueMock = { push: pushMock };

    const dispatchMock = jest.fn();

    const progress: StoreProgress = getFlowProgressMock();

    const service = new ConstructCompletionsService(
      saveSummaryMock,
      {} as any,
      progress,
      pushToQueueMock,
      dispatchMock,
    );

    //@ts-expect-error
    service.queryDataUtils.getAppletDto = jest.fn().mockReturnValue({
      encryption: 'applet-encryption-mock-1',
      displayName: 'mock-applet-name-1',
    });

    await service.construct({
      completionType: 'intermediate',
      activityId: 'mock-activity-id-1',
      activityName: 'mock-activity-name-1',
      appletId: 'mock-applet-id-1',
      eventId: 'mock-event-id-1',
      flowId: 'mock-flow-id-1',
      order: 0,
    });

    expect(getActivityRecordMock).toBeCalledTimes(1);

    expect(createSvgFilesMock).toBeCalledTimes(1);

    expect(saveSummaryMock).toBeCalledTimes(0);

    expect(mapAnswersToDtoMock).toBeCalledTimes(1);

    expect(mockFillNullsForHiddenItems).toBeCalledTimes(1);

    expect(getItemIdsMock).toBeCalledTimes(1);

    expect(getFlowRecordMock).toBeCalledTimes(1);

    expect(getUserIdentifierMock).toBeCalledTimes(1);

    expect(mapUserActionsToDtoMock).toBeCalledTimes(1);

    expect(mapAnswersToAlertsMock).toBeCalledTimes(1);

    expect(getClientInformationMock).toBeCalledTimes(1);

    expect(clearActivityStorageRecordMock).toBeCalledTimes(1);

    expect(pushMock).toBeCalledTimes(1);

    expect(pushMock).toBeCalledWith({
      activityId: 'mock-activity-id-1',
      alerts: [],
      answers: [{ value: 3 }, { value: 8 }],
      appletEncryption: 'applet-encryption-mock-1',
      appletId: 'mock-applet-id-1',
      client: {
        appId: 'mock-app-name-1',
        appVersion: 'mock-app-version-1',
        height: 2358,
        width: 1347,
      },
      createdAt: 1680956820000,
      endTime: 1680956820000,
      eventId: 'mock-event-id-1',
      executionGroupKey: 'mock-flow-group-key-1',
      flowId: 'mock-flow-id-1',
      isFlowCompleted: false,
      itemIds: ['mock-slider-id-1', 'mock-slider-id-2'],
      logActivityName: 'mock-activity-name-1',
      logCompletedAt: 'Sat, 08 Apr 2023 12:27:00 GMT',
      scheduledTime: 1245800000,
      startTime: 12389100000,
      tzOffset: 3,
      userActions: [],
      userIdentifier: 'mock-user-id-1',
      version: 'applet-version-mock-1',
    });
  });

  it('Should push item to queue when hasSummary is true', async () => {
    const answersMock: Answers = {
      0: { answer: 3 },
      1: { answer: 8 },
    };

    const itemsMock: PipelineItem[] = [
      getSliderItem('mock-slider-item-1', 'mock-slider-id-1'),
      getSliderItem('mock-slider-item-2', 'mock-slider-id-2'),
    ];

    const userActionsMock: UserAction[] = getUserActionsMock(answersMock);

    const recordMock = getActivityRecordMockResult(
      answersMock,
      userActionsMock,
      itemsMock,
    )!;

    jest.spyOn(storageHelpers, 'getActivityRecord').mockReturnValue({
      ...recordMock,
      hasSummary: true,
    });

    const pushMock = jest.fn();

    const pushToQueueMock = { push: pushMock };

    const dispatchMock = jest.fn();

    const progress: StoreProgress = getFlowProgressMock();

    const service = new ConstructCompletionsService(
      saveSummaryMock,
      {} as any,
      progress,
      pushToQueueMock,
      dispatchMock,
    );

    //@ts-expect-error
    service.queryDataUtils.getAppletDto = jest.fn().mockReturnValue({
      encryption: 'applet-encryption-mock-1',
      displayName: 'mock-applet-name-1',
    });

    await service.construct({
      completionType: 'intermediate',
      activityId: 'mock-activity-id-1',
      activityName: 'mock-activity-name-1',
      appletId: 'mock-applet-id-1',
      eventId: 'mock-event-id-1',
      flowId: 'mock-flow-id-1',
      order: 0,
    });

    expect(saveSummaryMock).toBeCalledTimes(1);

    expect(saveSummaryMock).toBeCalledWith({
      activityId: 'mock-activity-id-1',
      alerts: [
        { activityItemId: 'mock-activity-item-1', message: 'mock-message-1' },
      ],
      order: 0,
      scores: {
        activityName: 'mock-activity-name-1',
        scores: [{ flagged: true, name: 'mock-score-name-1', value: 125 }],
      },
    });

    expect(pushMock).toBeCalledTimes(1);
  });
});

import { QueryClient } from '@tanstack/react-query';
import { addHours, addMilliseconds, subHours, subSeconds } from 'date-fns';

import { StoreProgress } from '@app/abstract/lib';
import { Answers, PipelineItem } from '@app/features/pass-survey';
import { getSliderItem } from '@app/features/pass-survey/model/tests/testHelpers';
import { AppletEncryptionDTO } from '@app/shared/api';

import {
  createGetActivityRecordMock,
  expectedUserActions,
  getActivityProgressMock,
  getFlowProgressMock,
  getInputsForFinish,
  getInputsForIntermediate,
  mockConstructionServiceExternals,
} from './testHelpers';
import * as operations from '../../operations';
import {
  CompletionType,
  ConstructCompletionsService,
} from '../ConstructCompletionsService';

jest.mock('@app/shared/lib/services/Logger', () => ({
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
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

const mockNowDate = new Date(2023, 3, 8, 15, 27);

describe('Test ConstructCompletionsService.constructForIntermediate', () => {
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

    const {
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
    } = mockConstructionServiceExternals(mockNowDate);

    const getActivityRecordMock = createGetActivityRecordMock(
      itemsMock,
      answersMock,
    );

    const pushToQueueMock = { push: jest.fn() };

    const progress: StoreProgress = getFlowProgressMock();

    const service = new ConstructCompletionsService(
      saveSummaryMock,
      {} as any,
      progress,
      pushToQueueMock,
      jest.fn(),
    );

    //@ts-expect-error
    service.queryDataUtils.getAppletDto = jest.fn().mockReturnValue({
      encryption: 'applet-encryption-mock-1',
      displayName: 'mock-applet-name-1',
    });

    await service.construct(getInputsForIntermediate());

    expect(getActivityRecordMock).toBeCalledTimes(1);

    expect(createSvgFilesMock).toBeCalledTimes(1);

    expect(saveSummaryMock).toBeCalledTimes(0);

    expect(mapAnswersToDtoMock).toBeCalledTimes(1);

    expect(mockFillNullsForHiddenItems).toBeCalledTimes(1);

    expect(getItemIdsMock).toBeCalledTimes(1);

    expect(getFlowRecordMock).toBeCalledTimes(1);

    expect(getUserIdentifierMock).toBeCalledTimes(1);

    expect(mapAnswersToAlertsMock).toBeCalledTimes(1);

    expect(getClientInformationMock).toBeCalledTimes(1);

    expect(clearActivityStorageRecordMock).toBeCalledTimes(1);

    expect(pushToQueueMock.push).toBeCalledTimes(1);

    expect(pushToQueueMock.push).toBeCalledWith({
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
      createdAt: mockNowDate.getTime(),
      endTime: mockNowDate.getTime(),
      eventId: 'mock-event-id-1',
      executionGroupKey: 'mock-flow-group-key-1',
      flowId: 'mock-flow-id-1',
      isFlowCompleted: false,
      itemIds: ['mock-slider-id-1', 'mock-slider-id-2'],
      logActivityName: 'mock-activity-name-1',
      logCompletedAt: mockNowDate.toUTCString(),
      scheduledTime: 1245800000,
      startTime: 12389100000,
      tzOffset: 3,
      userActions: expectedUserActions,
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

    const { saveSummaryMock } = mockConstructionServiceExternals(mockNowDate);

    createGetActivityRecordMock(itemsMock, answersMock, true);

    const pushToQueueMock = { push: jest.fn() };

    const progress: StoreProgress = getFlowProgressMock();

    const service = new ConstructCompletionsService(
      saveSummaryMock,
      {} as any,
      progress,
      pushToQueueMock,
      jest.fn(),
    );

    //@ts-expect-error
    service.queryDataUtils.getAppletDto = jest.fn().mockReturnValue({
      encryption: 'applet-encryption-mock-1',
      displayName: 'mock-applet-name-1',
    });

    await service.construct(getInputsForIntermediate());

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

    expect(pushToQueueMock.push).toBeCalledTimes(1);
  });
});

describe('Test ConstructCompletionsService.constructForFinish', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should push item to queue for activity flow', async () => {
    const answersMock: Answers = {
      0: { answer: 3 },
      1: { answer: 8 },
    };

    const itemsMock: PipelineItem[] = [
      getSliderItem('mock-slider-item-1', 'mock-slider-id-1'),
      getSliderItem('mock-slider-item-2', 'mock-slider-id-2'),
    ];

    const {
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
    } = mockConstructionServiceExternals(mockNowDate);

    const getActivityRecordMock = createGetActivityRecordMock(
      itemsMock,
      answersMock,
    );

    const pushToQueueMock = { push: jest.fn() };

    const progress: StoreProgress = getFlowProgressMock();

    const service = new ConstructCompletionsService(
      saveSummaryMock,
      {} as any,
      progress,
      pushToQueueMock,
      jest.fn(),
    );

    //@ts-expect-error
    service.queryDataUtils.getAppletDto = jest.fn().mockReturnValue({
      encryption: 'applet-encryption-mock-1',
      displayName: 'mock-applet-name-1',
    });

    await service.construct(getInputsForFinish('flow'));

    expect(getActivityRecordMock).toBeCalledTimes(1);

    expect(createSvgFilesMock).toBeCalledTimes(1);

    expect(saveSummaryMock).toBeCalledTimes(0);

    expect(mapAnswersToDtoMock).toBeCalledTimes(1);

    expect(mockFillNullsForHiddenItems).toBeCalledTimes(1);

    expect(getItemIdsMock).toBeCalledTimes(1);

    expect(getFlowRecordMock).toBeCalledTimes(1);

    expect(getUserIdentifierMock).toBeCalledTimes(1);

    expect(mapAnswersToAlertsMock).toBeCalledTimes(1);

    expect(getClientInformationMock).toBeCalledTimes(1);

    expect(clearActivityStorageRecordMock).toBeCalledTimes(1);

    expect(pushToQueueMock.push).toBeCalledTimes(1);

    expect(pushToQueueMock.push.mock.calls).toEqual([
      [
        {
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
          createdAt: mockNowDate.getTime(),
          endTime: mockNowDate.getTime(),
          eventId: 'mock-event-id-1',
          executionGroupKey: 'mock-flow-group-key-1',
          flowId: 'mock-flow-id-1',
          isFlowCompleted: true,
          itemIds: ['mock-slider-id-1', 'mock-slider-id-2'],
          logActivityName: 'mock-activity-name-1',
          logCompletedAt: mockNowDate.toUTCString(),
          scheduledTime: 1245800000,
          startTime: 12389100000,
          tzOffset: 3,
          userActions: expectedUserActions,
          userIdentifier: 'mock-user-id-1',
          version: 'applet-version-mock-1',
        },
      ],
    ]);
  });

  it('Should push item to queue for a single activity', async () => {
    const answersMock: Answers = {
      0: { answer: 3 },
      1: { answer: 8 },
    };

    const itemsMock: PipelineItem[] = [
      getSliderItem('mock-slider-item-1', 'mock-slider-id-1'),
      getSliderItem('mock-slider-item-2', 'mock-slider-id-2'),
    ];

    const {
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
    } = mockConstructionServiceExternals(mockNowDate);

    const getActivityRecordMock = createGetActivityRecordMock(
      itemsMock,
      answersMock,
    );

    const mockGetExecutionGroupKey = jest
      .spyOn(operations, 'getExecutionGroupKey')
      .mockReturnValue('mock-group-key-1');

    const pushToQueueMock = { push: jest.fn() };

    const progress: StoreProgress = getActivityProgressMock();

    const service = new ConstructCompletionsService(
      saveSummaryMock,
      {} as any,
      progress,
      pushToQueueMock,
      jest.fn(),
    );

    //@ts-expect-error
    service.queryDataUtils.getAppletDto = jest.fn().mockReturnValue({
      encryption: 'applet-encryption-mock-1',
      displayName: 'mock-applet-name-1',
    });

    await service.construct(getInputsForFinish('regular'));

    expect(getActivityRecordMock).toBeCalledTimes(1);

    expect(createSvgFilesMock).toBeCalledTimes(1);

    expect(saveSummaryMock).toBeCalledTimes(0);

    expect(mapAnswersToDtoMock).toBeCalledTimes(1);

    expect(mockFillNullsForHiddenItems).toBeCalledTimes(1);

    expect(getItemIdsMock).toBeCalledTimes(1);

    expect(getFlowRecordMock).toBeCalledTimes(1);

    expect(getUserIdentifierMock).toBeCalledTimes(1);

    expect(mapAnswersToAlertsMock).toBeCalledTimes(1);

    expect(getClientInformationMock).toBeCalledTimes(1);

    expect(clearActivityStorageRecordMock).toBeCalledTimes(1);

    expect(mockGetExecutionGroupKey).toBeCalledTimes(1);

    expect(pushToQueueMock.push).toBeCalledTimes(1);

    expect(pushToQueueMock.push.mock.calls).toEqual([
      [
        {
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
          createdAt: mockNowDate.getTime(),
          endTime: mockNowDate.getTime(),
          eventId: 'mock-event-id-1',
          executionGroupKey: 'mock-group-key-1',
          flowId: null,
          isFlowCompleted: false,
          itemIds: ['mock-slider-id-1', 'mock-slider-id-2'],
          logActivityName: 'mock-activity-name-1',
          logCompletedAt: mockNowDate.toUTCString(),
          scheduledTime: 1245800000,
          startTime: 12367800000,
          tzOffset: 3,
          userActions: expectedUserActions,
          userIdentifier: 'mock-user-id-1',
          version: 'applet-version-mock-1',
        },
      ],
    ]);
  });
});

describe('Test ConstructCompletionsService: edge cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('"getAppletProperties" should throw error when no applet dto in the cache', () => {
    const progress: StoreProgress = getFlowProgressMock();

    const pushToQueueMock = { push: jest.fn() };

    const { saveSummaryMock } = mockConstructionServiceExternals(mockNowDate);

    const service = new ConstructCompletionsService(
      saveSummaryMock,
      {} as any,
      progress,
      pushToQueueMock,
      jest.fn(),
    );

    //@ts-expect-error
    service.queryDataUtils.getAppletDto = jest.fn().mockReturnValue(null);

    //@ts-expect-error
    expect(() => service.getAppletProperties('mock-not-exist-id')).toThrow(
      new Error(
        "[ConstructCompletionsService] Applet doesn't exist in the cache, appletId=mock-not-exist-id ",
      ),
    );
  });

  const validateEncryptionTests = [
    {
      appletEncryption: null,
      expectedError:
        '[ConstructCompletionsService] Encryption params is undefined',
    },
    {
      appletEncryption: undefined,
      expectedError:
        '[ConstructCompletionsService] Encryption params is undefined',
    },
  ];

  validateEncryptionTests.forEach(({ appletEncryption, expectedError }) => {
    const appletEncryptionAsText = appletEncryption
      ? 'fullfilled'
      : String(appletEncryption);

    it(`"validateEncryption" should throw error when appletEncryption is ${appletEncryptionAsText}`, () => {
      const progress: StoreProgress = getFlowProgressMock();

      const { saveSummaryMock } = mockConstructionServiceExternals(mockNowDate);

      const pushMock = jest.fn();

      const pushToQueueMock = { push: pushMock };

      const service = new ConstructCompletionsService(
        saveSummaryMock,
        {} as QueryClient,
        progress,
        pushToQueueMock,
        jest.fn(),
      );

      expect(() =>
        // @ts-expect-error
        service.validateEncryption(appletEncryption as AppletEncryptionDTO),
      ).toThrow(new Error(expectedError));
    });
  });

  const checkRecordTests = [
    {
      activityStorageRecord: null,
      expectedResult: false,
    },
    {
      activityStorageRecord: undefined,
      expectedResult: false,
    },
    {
      activityStorageRecord: {},
      expectedResult: true,
    },
  ];

  checkRecordTests.forEach(({ activityStorageRecord, expectedResult }) => {
    const activityStorageRecordAsText = activityStorageRecord
      ? 'fullfilled'
      : String(activityStorageRecord);

    it(`"validate" should throw error when activityStorageRecord is ${activityStorageRecordAsText}`, () => {
      const progress: StoreProgress = getFlowProgressMock();

      const { saveSummaryMock } = mockConstructionServiceExternals(mockNowDate);

      const pushMock = jest.fn();

      const pushToQueueMock = { push: pushMock };

      const service = new ConstructCompletionsService(
        saveSummaryMock,
        {} as QueryClient,
        progress,
        pushToQueueMock,
        jest.fn(),
      );

      //@ts-expect-error
      const result = service.isRecordExist(activityStorageRecord);

      expect(result).toEqual(expectedResult);
    });
  });
});

describe('Test ConstructCompletionsService: evaluateEndAt', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const now = mockNowDate.getTime();

  const tests = [
    {
      completionType: 'intermediate',
      availableTo: null,
      logAvailableTo: 'null',
      isAutocompletion: false,
      expectedResult: now,
      expectedResultLog: 'now',
    },
    {
      completionType: 'intermediate',
      availableTo: subHours(now, 1).getTime(),
      logAvailableTo: 'subHours(now, 1)',
      isAutocompletion: false,
      expectedResult: now,
      expectedResultLog: 'now',
    },
    {
      completionType: 'intermediate',
      availableTo: subHours(now, 1).getTime(),
      logAvailableTo: 'subHours(now, 1)',
      isAutocompletion: true,
      expectedResult: subSeconds(subHours(now, 1), 1).getTime(),
      expectedResultLog: 'subSeconds(subHours(now, 1), 1)',
    },
    {
      completionType: 'finish',
      availableTo: null,
      logAvailableTo: 'null',
      isAutocompletion: false,
      expectedResult: now,
      expectedResultLog: 'now',
    },
    {
      completionType: 'finish',
      availableTo: subHours(now, 1).getTime(),
      logAvailableTo: 'subHours(now, 1)',
      isAutocompletion: false,
      expectedResult: now,
      expectedResultLog: 'now',
    },
    {
      completionType: 'finish',
      availableTo: subHours(now, 1).getTime(),
      logAvailableTo: 'subHours(now, 1)',
      isAutocompletion: true,
      expectedResult: addMilliseconds(
        subSeconds(subHours(now, 1), 1),
        1,
      ).getTime(),
      expectedResultLog: 'addMilliseconds(subSeconds(subHours(now, 1), 1), 1)',
    },
    {
      completionType: 'finish',
      availableTo: addHours(now, 1).getTime(),
      logAvailableTo: 'addHours(now, 1)',
      isAutocompletion: true,
      expectedResult: addMilliseconds(now, 1).getTime(),
      expectedResultLog: 'addMilliseconds(now, 1)',
    },
    {
      completionType: 'intermediate',
      availableTo: addHours(now, 1).getTime(),
      logAvailableTo: 'addHours(now, 1)',
      isAutocompletion: true,
      expectedResult: now,
      expectedResultLog: ' now',
    },
  ];

  tests.forEach(
    ({
      completionType,
      availableTo,
      logAvailableTo,
      isAutocompletion,
      expectedResult,
      expectedResultLog,
    }) => {
      it(`Should return '${expectedResultLog}' when completionType is ${completionType} and availableTo is '${logAvailableTo}' and isAutocompletion is ${isAutocompletion}`, () => {
        const progress: StoreProgress = getFlowProgressMock();

        const pushToQueueMock = { push: jest.fn() };

        const { saveSummaryMock } =
          mockConstructionServiceExternals(mockNowDate);

        const service = new ConstructCompletionsService(
          saveSummaryMock,
          {} as QueryClient,
          progress,
          pushToQueueMock,
          jest.fn(),
        );

        // @ts-expect-error
        const result = service.evaluateEndAt(
          completionType as CompletionType,
          availableTo,
          isAutocompletion,
        );

        expect(result).toEqual(expectedResult);
      });
    },
  );
});

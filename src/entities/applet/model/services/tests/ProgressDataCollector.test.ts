import { getDefaultEventsService } from '@app/shared/api/services/eventsServiceInstance';
import { EntitiesCompletionsDto } from '@app/shared/api/services/IEventsService';
import { getDefaultFeatureFlagsService } from '@app/shared/lib/featureFlags/featureFlagsServiceInstance';
import { ILogger } from '@app/shared/lib/types/logger';

import { ProgressDataCollector } from '../ProgressDataCollector';

type MockedResponse = {
  data?: {
    result?: Array<EntitiesCompletionsDto>;
  };
};

const getAllCompletedEntitiesMock = jest.fn();

const warnMock = jest.fn();

const loggerMock = {
  warn: () => warnMock() as void,
} as unknown as ILogger;

describe('Test ProgressDataCollector', () => {
  beforeEach(() => {
    jest
      .spyOn(getDefaultEventsService(), 'getAllCompletedEntities')
      .mockImplementation(() => {
        return getAllCompletedEntitiesMock() as never;
      });

    jest
      .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
      .mockReturnValue(['*']); // '*' = enabled for all applets
  });

  it('Should return 2 completions when api response is fulfilled with 2 items', async () => {
    const collector = new ProgressDataCollector(loggerMock);

    const mockedValue: MockedResponse = {
      data: {
        result: [
          {
            id: 'mock-id-1',
            version: 'mock-version-1',
            activities: [
              {
                id: 'mock-id-10',
                answerId: 'mock-answerId-10',
                localEndDate: '2021-10-07',
                localEndTime: '01:02:03',
                scheduledEventId: 'mock-scheduledEventId-10',
                targetSubjectId: 'mock-subject-1',
                submitId: 'mock-submitId-10',
                startTime: 1633568523000,
                endTime: 1633568523000,
              },
            ],
            activityFlows: [],
          },
          {
            id: 'mock-id-2',
            version: 'mock-version-2',
            activities: [],
            activityFlows: [
              {
                id: 'mock-id-11',
                answerId: 'mock-answerId-11',
                localEndDate: '2021-10-08',
                localEndTime: '01:02:05',
                scheduledEventId: 'mock-scheduledEventId-11',
                targetSubjectId: 'mock-subject-1',
                submitId: 'mock-submitId-11',
                startTime: 1633654925000,
                endTime: 1633654925000,
              },
            ],
          },
        ],
      },
    };

    getAllCompletedEntitiesMock.mockResolvedValue(mockedValue);

    const result = await collector.collect();

    expect(result).toEqual({
      appletEntities: {
        'mock-id-1': {
          activities: [
            {
              answerId: 'mock-answerId-10',
              id: 'mock-id-10',
              localEndDate: '2021-10-07',
              localEndTime: '01:02:03',
              scheduledEventId: 'mock-scheduledEventId-10',
              targetSubjectId: 'mock-subject-1',
              submitId: 'mock-submitId-10',
              startTime: 1633568523000,
              endTime: 1633568523000,
            },
          ],
          activityFlows: [],
          id: 'mock-id-1',
          version: 'mock-version-1',
        },
        'mock-id-2': {
          activities: [],
          activityFlows: [
            {
              answerId: 'mock-answerId-11',
              id: 'mock-id-11',
              localEndDate: '2021-10-08',
              localEndTime: '01:02:05',
              scheduledEventId: 'mock-scheduledEventId-11',
              targetSubjectId: 'mock-subject-1',
              submitId: 'mock-submitId-11',
              startTime: 1633654925000,
              endTime: 1633654925000,
            },
          ],
          id: 'mock-id-2',
          version: 'mock-version-2',
        },
      },
    });
  });

  it('Should return 0 completions when api response is empty array', async () => {
    const collector = new ProgressDataCollector(loggerMock);

    const mockedValue: MockedResponse = {
      data: {
        result: [],
      },
    };

    getAllCompletedEntitiesMock.mockResolvedValue(mockedValue);

    const result = await collector.collect();

    expect(result).toEqual({ appletEntities: {} });
  });

  it('Should pass includeInProgress: true to getAllCompletedEntities', async () => {
    const collector = new ProgressDataCollector(loggerMock);

    const mockedValue: MockedResponse = {
      data: {
        result: [],
      },
    };

    getAllCompletedEntitiesMock.mockResolvedValue(mockedValue);

    await collector.collect();

    expect(
      getDefaultEventsService().getAllCompletedEntities,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        fromDate: expect.any(String) as string,
        includeInProgress: true,
      }),
    );
  });

  const negativeTests: Array<MockedResponse | null | undefined> = [
    null,
    undefined,
    {
      data: undefined,
    },
    {
      data: { result: undefined },
    },
  ];

  negativeTests.forEach(response => {
    it(`Should return 0 completions when response is ${JSON.stringify(response)}`, async () => {
      const collector = new ProgressDataCollector(loggerMock);

      getAllCompletedEntitiesMock.mockResolvedValue(response);

      const result = await collector.collect();

      expect(result).toEqual({ appletEntities: {} });
    });
  });

  it(`Should return 0 completions when api call throws error`, async () => {
    const collector = new ProgressDataCollector(loggerMock);

    getAllCompletedEntitiesMock.mockRejectedValue('Error occurred');

    const result = await collector.collect();

    expect(result).toEqual({ appletEntities: {} });

    expect(warnMock).toHaveBeenCalledTimes(1);
  });
});

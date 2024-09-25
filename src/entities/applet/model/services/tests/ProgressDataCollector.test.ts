import { EntitiesCompletionsDto } from '@app/shared/api/services/IEventsService';
import { ILogger } from '@app/shared/lib/types/logger';

import { ProgressDataCollector } from '../ProgressDataCollector';

type MockedResponse = {
  data?: {
    result?: Array<EntitiesCompletionsDto>;
  };
};

const getAllCompletedEntitiesMock = jest.fn();

jest.mock('@app/shared/api', () => ({
  EventsService: {
    getAllCompletedEntities: () =>
      getAllCompletedEntitiesMock() as MockedResponse,
  },
}));

const warnMock = jest.fn();

const loggerMock = {
  warn: () => warnMock() as void,
} as unknown as ILogger;

describe('Test ProgressDataCollector', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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
              submitId: 'mock-submitId-10',
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
              submitId: 'mock-submitId-11',
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

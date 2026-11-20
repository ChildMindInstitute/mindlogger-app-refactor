import { IAppletService } from '@app/shared/api/services/IAppletService';
import { IEventsService } from '@app/shared/api/services/IEventsService';
import { ILogger } from '@app/shared/lib/types/logger';

import { RefreshDataCollector } from '../RefreshDataCollector';

const getAllAppletAssignmentsMock = jest.fn();

const appletServiceMock = {
  getAllAppletAssignments: getAllAppletAssignmentsMock,
} as unknown as IAppletService;

const eventsServiceMock = {} as IEventsService;

const loggerMock = {
  log: jest.fn(),
  warn: jest.fn(),
} as unknown as ILogger;

const createAssignment = (id: string) => ({
  id,
  activityId: 'mock-activity-id',
  activityFlowId: null,
  respondentSubject: { id: 'mock-respondent-id' },
  targetSubject: { id: 'mock-target-id' },
});

const createAppletAssignmentsResponse = (
  appletId: string,
  assignments: unknown[],
) => ({
  data: {
    result: {
      appletId,
      assignments,
    },
  },
});

describe('Test RefreshDataCollector.collectAllAppletAssignments', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should get all assignments in one request and key them by applet id', async () => {
    const collector = new RefreshDataCollector(
      loggerMock,
      appletServiceMock,
      eventsServiceMock,
    );

    getAllAppletAssignmentsMock.mockResolvedValue({
      data: {
        result: [
          {
            appletId: 'mock-applet-id-1',
            assignments: [createAssignment('mock-assignment-id-1')],
          },
          { appletId: 'mock-applet-id-2', assignments: [] },
          {
            appletId: 'mock-applet-id-not-listed',
            assignments: [createAssignment('mock-assignment-id-2')],
          },
        ],
      },
    });

    const result = await collector.collectAllAppletAssignments([
      'mock-applet-id-1',
      'mock-applet-id-2',
      'mock-applet-id-3',
    ]);

    expect(getAllAppletAssignmentsMock).toBeCalledTimes(1);
    expect(result).toEqual({
      appletAssignments: {
        'mock-applet-id-1': createAppletAssignmentsResponse(
          'mock-applet-id-1',
          [createAssignment('mock-assignment-id-1')],
        ),
        'mock-applet-id-2': createAppletAssignmentsResponse(
          'mock-applet-id-2',
          [],
        ),
        'mock-applet-id-3': createAppletAssignmentsResponse(
          'mock-applet-id-3',
          [],
        ),
      },
    });
  });

  it('Should not make a request when there are no applets', async () => {
    const collector = new RefreshDataCollector(
      loggerMock,
      appletServiceMock,
      eventsServiceMock,
    );

    const result = await collector.collectAllAppletAssignments([]);

    expect(getAllAppletAssignmentsMock).toBeCalledTimes(0);
    expect(result).toEqual({ appletAssignments: {} });
  });

  it('Should reject when getting assignments fails', async () => {
    const collector = new RefreshDataCollector(
      loggerMock,
      appletServiceMock,
      eventsServiceMock,
    );

    getAllAppletAssignmentsMock.mockRejectedValue(new Error('mock-error'));

    await expect(
      collector.collectAllAppletAssignments(['mock-applet-id-1']),
    ).rejects.toThrow('mock-error');
  });
});

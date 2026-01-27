import {
  AppletDetailsDto,
  ActivityRecordDto,
  ActivityFlowRecordDto,
} from '@app/shared/api/services/IAppletService';
import { EntitiesCompletionsDto } from '@app/shared/api/services/IEventsService';
import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { QueryClient } from '@tanstack/react-query';

import { ProgressSyncService } from '../ProgressSyncService';

const mockDispatch = jest.fn();
const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
} as unknown as ILogger;

const mockQueryClient = new QueryClient();

const mockState: any = {
  applets: {
    entityProgressions: [],
  },
};

const createActivityDto = (
  id: string,
  name: string,
  order: number,
): ActivityRecordDto => ({
  id,
  name,
  description: '',
  image: null,
  isReviewable: false,
  isSkippable: false,
  showAllAtOnce: false,
  isHidden: false,
  responseIsEditable: false,
  order,
  autoAssign: false,
  splashScreen: null,
});

const createFlowDto = (
  id: string,
  name: string,
  activityIds: string[],
  order: number,
): ActivityFlowRecordDto => ({
  id,
  name,
  description: '',
  hideBadge: false,
  isSingleReport: false,
  order,
  autoAssign: false,
  isHidden: false,
  activityIds,
});

const createAppletDto = (
  activityDtos: ActivityRecordDto[],
  flowDtos: ActivityFlowRecordDto[],
): AppletDetailsDto => ({
  id: 'applet-1',
  displayName: 'Test Applet',
  version: '1.0.0',
  description: '',
  about: '',
  image: null,
  watermark: null,
  theme: null,
  encryption: null,
  activities: activityDtos,
  activityFlows: flowDtos,
  streamEnabled: false,
  streamIpAddress: null,
  streamPort: null,
  integrations: [],
});

describe('ProgressSyncService - Cross-device flow sync', () => {
  let service: ProgressSyncService;
  let mockFlowStorage: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockState.applets.entityProgressions = [];
    service = new ProgressSyncService(mockState, mockDispatch, mockLogger, mockQueryClient);

    mockFlowStorage = {
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
      contains: jest.fn(),
    };

    jest
      .spyOn(getDefaultStorageInstanceManager(), 'getFlowProgressStorage')
      .mockReturnValue(mockFlowStorage);
  });

  describe('Flow state reconstruction for in-progress flows', () => {
    it('should reconstruct FlowState when syncing in-progress flow', () => {
      const mockAppletDto = createAppletDto(
        [
          createActivityDto('activity-1', 'Activity 1', 0),
          createActivityDto('activity-2', 'Activity 2', 1),
          createActivityDto('activity-3', 'Activity 3', 2),
        ],
        [
          createFlowDto(
            'flow-1',
            'Test Flow',
            ['activity-1', 'activity-2', 'activity-3'],
            0,
          ),
        ],
      );

      const completions: EntitiesCompletionsDto = {
        id: 'applet-1',
        version: '1.0.0',
        activities: [],
        activityFlows: [
          {
            id: 'flow-1',
            answerId: 'answer-1',
            submitId: 'submit-1',
            scheduledEventId: 'event-1',
            targetSubjectId: '',
            localEndDate: null,
            localEndTime: null,
            startTime: 1706368800000,
            endTime: 1706369400000,
            isFlowCompleted: false,
            activityFlowOrder: 1, // Second activity
          },
        ],
      };

      service.sync(mockAppletDto, completions);

      // Verify FlowState was saved
      expect(mockFlowStorage.set).toHaveBeenCalled();

      const savedState = JSON.parse(mockFlowStorage.set.mock.calls[0][1]);
      expect(savedState.step).toBe(2); // activityFlowOrder 1 * 2 = step 2
      expect(savedState.flowName).toBe('Test Flow');
      expect(savedState.pipeline.length).toBeGreaterThan(0);
    });
  });

  describe('Flow completion cleanup', () => {
    it('should delete FlowState when flow is completed on server', () => {
      const mockAppletDto = createAppletDto(
        [createActivityDto('activity-1', 'Activity 1', 0)],
        [createFlowDto('flow-1', 'Test Flow', ['activity-1'], 0)],
      );

      const completions: EntitiesCompletionsDto = {
        id: 'applet-1',
        version: '1.0.0',
        activities: [],
        activityFlows: [
          {
            id: 'flow-1',
            answerId: 'answer-1',
            submitId: 'submit-1',
            scheduledEventId: 'event-1',
            targetSubjectId: '',
            localEndDate: '2026-01-26',
            localEndTime: '12:00:00',
            startTime: 1706270400000,
            endTime: 1706274000000,
            isFlowCompleted: true,
          },
        ],
      };

      service.sync(mockAppletDto, completions);

      expect(mockFlowStorage.delete).toHaveBeenCalled();
    });

    it('should not cleanup FlowState if flow was restarted locally after server completion', () => {
      const localStartTime = new Date('2026-01-26T11:00:00').getTime();

      mockState.applets.entityProgressions = [
        {
          appletId: 'applet-1',
          entityType: 'activityFlow',
          entityId: 'flow-1',
          eventId: 'event-1',
          targetSubjectId: '',
          startedAtTimestamp: localStartTime,
        },
      ];

      const mockAppletDto: AppletDetailsDto = {
        id: 'applet-1',
        displayName: 'Test Applet',
        version: '1.0.0',
        description: '',
        about: '',
        image: null,
        watermark: null,
        theme: null,
        encryption: null,
        activities: [
          {
            id: 'activity-1',
            name: 'Activity 1',
            description: '',
            image: null,
            order: 0,
            isHidden: false,
            autoAssign: false,
            isReviewable: false,
            isSkippable: false,
            responseIsEditable: false,
            showAllAtOnce: false,
            splashScreen: null,
          },
        ],
        activityFlows: [
          {
            id: 'flow-1',
            name: 'Test Flow',
            description: '',
            isSingleReport: false,
            hideBadge: false,
            order: 0,
            activityIds: ['activity-1'],
            isHidden: false,
            autoAssign: false,
          },
        ],
        streamEnabled: false,
        streamIpAddress: null,
        streamPort: null,
        integrations: [],
      };

      const completions: EntitiesCompletionsDto = {
        id: 'applet-1',
        version: '1.0.0',
        activities: [],
        activityFlows: [
          {
            id: 'flow-1',
            answerId: 'answer-1',
            submitId: 'submit-1',
            scheduledEventId: 'event-1',
            targetSubjectId: '',
            localEndDate: '2026-01-26',
            localEndTime: '10:00:00', // Completed at 10:00, but locally restarted at 11:00
            startTime: 1706263200000,
            endTime: 1706266800000,
            isFlowCompleted: true,
          },
        ],
      };

      service.sync(mockAppletDto, completions);

      // Should NOT delete because local flow was started after server completion
      expect(mockFlowStorage.delete).not.toHaveBeenCalled();
    });
  });
});

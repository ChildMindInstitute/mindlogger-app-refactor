import { QueryClient } from '@tanstack/react-query';

import {
  AppletDetailsDto,
  ActivityRecordDto,
  ActivityFlowRecordDto,
} from '@app/shared/api/services/IAppletService';
import { EntitiesCompletionsDto } from '@app/shared/api/services/IEventsService';
import { getDefaultFeatureFlagsService } from '@app/shared/lib/featureFlags/featureFlagsServiceInstance';
import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';
import { ILogger } from '@app/shared/lib/types/logger';

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
    service = new ProgressSyncService(
      mockState,
      mockDispatch,
      mockLogger,
      mockQueryClient,
    );

    mockFlowStorage = {
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
      contains: jest.fn(),
    };

    jest
      .spyOn(getDefaultStorageInstanceManager(), 'getFlowProgressStorage')
      .mockReturnValue(mockFlowStorage);

    jest
      .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
      .mockReturnValue(['*']); // '*' = enabled for all applets
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

describe('ProgressSyncService - Feature flag disabled behavior for in-progress flows', () => {
  let service: ProgressSyncService;
  let mockFlowStorage: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockState.applets.entityProgressions = [];
    service = new ProgressSyncService(
      mockState,
      mockDispatch,
      mockLogger,
      mockQueryClient,
    );

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

  describe('When feature flag is disabled for in-progress flows', () => {
    it('does not dispatch in-progress flows to prevent incorrect completion status', () => {
      // Flag OFF for all applets
      jest
        .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
        .mockReturnValue([]);

      const mockAppletDto = createAppletDto(
        [
          createActivityDto('activity-1', 'Activity 1', 0),
          createActivityDto('activity-2', 'Activity 2', 1),
        ],
        [
          createFlowDto(
            'flow-1',
            'One-Time Flow',
            ['activity-1', 'activity-2'],
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
            targetSubjectId: null,
            localEndDate: null,
            localEndTime: null,
            startTime: 1706368800000,
            endTime: 1706369400000,
            isFlowCompleted: false, // In-progress
            activityFlowOrder: 1,
          },
        ],
      };

      service.sync(mockAppletDto, completions);

      // Critical: dispatch NOT called — without fix, would dispatch with isInProgress=undefined
      // causing Redux to create status:'completed', hiding one-time-completion flows
      expect(mockDispatch).not.toHaveBeenCalled();

      // FlowState should NOT be reconstructed either
      expect(mockFlowStorage.set).not.toHaveBeenCalled();
    });
  });

  describe('When feature flag is disabled for completed flows', () => {
    it('still processes completed flows to maintain backward compatibility', () => {
      // Flag OFF for all applets
      jest
        .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
        .mockReturnValue([]);

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
            targetSubjectId: null,
            localEndDate: '2026-01-26',
            localEndTime: '12:00:00',
            startTime: 1706270400000,
            endTime: 1706274000000,
            isFlowCompleted: true, // Completed
          },
        ],
      };

      service.sync(mockAppletDto, completions);

      // Completed flows must STILL be dispatched (legacy behavior)
      expect(mockDispatch).toHaveBeenCalledTimes(1);

      const dispatchedAction = mockDispatch.mock.calls[0][0];
      expect(dispatchedAction.type).toBe('applets/upsertEntityProgression');
      expect(dispatchedAction.payload.entityId).toBe('flow-1');
      expect(dispatchedAction.payload.entityType).toBe('activityFlow');
      // When flag OFF, isInProgress NOT set (undefined = legacy path)
      expect(dispatchedAction.payload.isInProgress).toBeUndefined();
    });
  });

  describe('When feature flag is disabled for activity completions', () => {
    it('still processes activity completions normally', () => {
      // Flag OFF for all applets
      jest
        .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
        .mockReturnValue([]);

      const mockAppletDto = createAppletDto(
        [createActivityDto('activity-1', 'Activity 1', 0)],
        [createFlowDto('flow-1', 'Test Flow', ['activity-1'], 0)],
      );

      const completions: EntitiesCompletionsDto = {
        id: 'applet-1',
        version: '1.0.0',
        activities: [
          {
            id: 'activity-1', // Activity, not a flow
            answerId: 'answer-1',
            submitId: 'submit-1',
            scheduledEventId: 'event-1',
            targetSubjectId: null,
            localEndDate: '2026-01-26',
            localEndTime: '12:00:00',
          },
        ],
        activityFlows: [],
      };

      service.sync(mockAppletDto, completions);

      // Activity completions must work regardless of feature flag
      expect(mockDispatch).toHaveBeenCalledTimes(1);

      const dispatchedAction = mockDispatch.mock.calls[0][0];
      expect(dispatchedAction.type).toBe('applets/upsertEntityProgression');
      expect(dispatchedAction.payload.entityId).toBe('activity-1');
      expect(dispatchedAction.payload.entityType).toBe('activity');
    });
  });

  describe('When feature flag is enabled', () => {
    it('dispatches in-progress flows with full payload to enable cross-device resume', () => {
      // Flag ON for all applets
      jest
        .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
        .mockReturnValue(['*']);

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
            targetSubjectId: null,
            localEndDate: null,
            localEndTime: null,
            startTime: 1706368800000,
            endTime: 1706369400000,
            isFlowCompleted: false,
            activityFlowOrder: 1,
          },
        ],
      };

      service.sync(mockAppletDto, completions);

      expect(mockDispatch).toHaveBeenCalledTimes(1);

      const dispatchedAction = mockDispatch.mock.calls[0][0];
      expect(dispatchedAction.type).toBe('applets/upsertEntityProgression');
      expect(dispatchedAction.payload.isInProgress).toBe(true);
      expect(dispatchedAction.payload.entityType).toBe('activityFlow');
      expect(dispatchedAction.payload.activityFlowOrder).toBe(1);
      expect(dispatchedAction.payload.currentActivityId).toBe('activity-2');
      expect(dispatchedAction.payload.currentActivityName).toBe('Activity 2');
      expect(dispatchedAction.payload.totalActivitiesInPipeline).toBe(3);

      // FlowState should also be reconstructed
      expect(mockFlowStorage.set).toHaveBeenCalled();
    });
  });

  describe('When feature flag is enabled for specific applets only', () => {
    it('skips in-progress flows for disabled applets while processing enabled applets', () => {
      // Flag enabled ONLY for applet-enabled, not for applet-1
      jest
        .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
        .mockReturnValue(['applet-enabled']);

      // First: sync applet-1 (flag OFF) with in-progress flow
      const appletDtoFlagOff = createAppletDto(
        [
          createActivityDto('activity-1', 'Activity 1', 0),
          createActivityDto('activity-2', 'Activity 2', 1),
        ],
        [
          createFlowDto(
            'flow-1',
            'Flow in OFF applet',
            ['activity-1', 'activity-2'],
            0,
          ),
        ],
      );
      // appletDtoFlagOff.id is 'applet-1' which is NOT in the flag array

      const completionsFlagOff: EntitiesCompletionsDto = {
        id: 'applet-1',
        version: '1.0.0',
        activities: [],
        activityFlows: [
          {
            id: 'flow-1',
            answerId: 'answer-1',
            submitId: 'submit-1',
            scheduledEventId: 'event-1',
            targetSubjectId: null,
            localEndDate: null,
            localEndTime: null,
            startTime: 1706368800000,
            endTime: 1706369400000,
            isFlowCompleted: false,
            activityFlowOrder: 1,
          },
        ],
      };

      service.sync(appletDtoFlagOff, completionsFlagOff);

      // applet-1 has flag OFF, in-progress flow SKIPPED
      expect(mockDispatch).not.toHaveBeenCalled();

      // Now: sync applet-enabled (flag ON) with in-progress flow
      jest.clearAllMocks();
      mockFlowStorage = {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
        contains: jest.fn(),
      };
      jest
        .spyOn(getDefaultStorageInstanceManager(), 'getFlowProgressStorage')
        .mockReturnValue(mockFlowStorage);
      jest
        .spyOn(getDefaultFeatureFlagsService(), 'evaluateFlagArray')
        .mockReturnValue(['applet-enabled']);

      const appletDtoFlagOn: AppletDetailsDto = {
        ...createAppletDto(
          [
            createActivityDto('activity-a', 'Activity A', 0),
            createActivityDto('activity-b', 'Activity B', 1),
          ],
          [
            createFlowDto(
              'flow-a',
              'Flow in ON applet',
              ['activity-a', 'activity-b'],
              0,
            ),
          ],
        ),
        id: 'applet-enabled', // This IS in the flag array
      };

      const completionsFlagOn: EntitiesCompletionsDto = {
        id: 'applet-enabled',
        version: '1.0.0',
        activities: [],
        activityFlows: [
          {
            id: 'flow-a',
            answerId: 'answer-a',
            submitId: 'submit-a',
            scheduledEventId: 'event-a',
            targetSubjectId: null,
            localEndDate: null,
            localEndTime: null,
            startTime: 1706368800000,
            endTime: 1706369400000,
            isFlowCompleted: false,
            activityFlowOrder: 1,
          },
        ],
      };

      service.sync(appletDtoFlagOn, completionsFlagOn);

      // applet-enabled has flag ON, in-progress flow PROCESSED
      expect(mockDispatch).toHaveBeenCalledTimes(1);

      const dispatchedAction = mockDispatch.mock.calls[0][0];
      expect(dispatchedAction.payload.isInProgress).toBe(true);
      expect(dispatchedAction.payload.entityId).toBe('flow-a');
    });
  });
});

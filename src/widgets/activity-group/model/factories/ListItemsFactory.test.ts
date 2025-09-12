import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import {
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import {
  ActivityStatus,
  ActivityType,
} from '@app/entities/activity/lib/types/activityListItem';
import { ScheduleEvent } from '@app/entities/event/lib/types/event';
import { ILogger } from '@app/shared/lib/types/logger';

import { ListItemsFactory } from './ListItemsFactory';
import {
  Activity,
  ActivityFlow,
  EventEntity,
  GroupsBuildContext,
} from '../../lib/types/activityGroupsBuilder';

// Mock logger for testing
const createMockLogger = (): ILogger => ({
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  configure: jest.fn(),
  send: jest.fn().mockResolvedValue(true),
  cancelSending: jest.fn(),
  clearAllLogFiles: jest.fn(),
});

// Test data factories
const createMockActivity = (
  id: string,
  name: string = 'Test Activity',
): Activity => ({
  id,
  name,
  description: `Description for ${name}`,
  image: null,
  isHidden: false,
  autoAssign: true,
  order: 1,
  type: ActivityType.NotDefined,
  pipelineType: ActivityPipelineType.Regular,
});

const createMockActivityFlow = (
  id: string,
  name: string = 'Test Flow',
  activityIds: string[] = [],
): ActivityFlow => ({
  id,
  name,
  description: `Description for ${name}`,
  image: null,
  isHidden: false,
  autoAssign: true,
  order: 1,
  hideBadge: false,
  activityIds,
  pipelineType: ActivityPipelineType.Flow,
});

const createMockEvent = (
  id: string = 'event-1',
  entityId: string = 'entity-1',
): ScheduleEvent => ({
  id,
  entityId,
  availability: {
    availabilityType: AvailabilityType.AlwaysAvailable,
    oneTimeCompletion: false,
    periodicityType: PeriodicityType.Daily,
    allowAccessBeforeFromTime: false,
    startDate: null,
    endDate: null,
    timeFrom: null,
    timeTo: null,
  },
  scheduledAt: new Date(),
  selectedDate: null,
  timers: {
    timer: null,
    idleTimer: null,
  },
  notificationSettings: {
    notifications: [],
    reminder: null,
  },
});

const createMockEventEntity = (
  entity: Activity | ActivityFlow,
  eventId: string = 'event-1',
): EventEntity => ({
  entity,
  event: createMockEvent(eventId),
  assignment: null,
});

const createMockGroupsBuildContext = (
  activities: Activity[] = [],
  appletId: string = 'test-applet',
): GroupsBuildContext => ({
  appletId,
  allAppletActivities: activities,
  entityProgressions: [],
});

describe('ListItemsFactory', () => {
  let factory: ListItemsFactory;
  let mockLogger: ILogger;
  let mockActivities: Activity[];

  beforeEach(() => {
    mockLogger = createMockLogger();
    mockActivities = [
      createMockActivity('activity-1', 'Activity 1'),
      createMockActivity('activity-2', 'Activity 2'),
    ];
    const context = createMockGroupsBuildContext(mockActivities);
    factory = new ListItemsFactory(context, mockLogger);
  });

  describe('constructor', () => {
    it('should create factory with logger and context', () => {
      expect(factory).toBeInstanceOf(ListItemsFactory);
    });
  });

  describe('safeGetActivity', () => {
    it('should return activity when it exists', () => {
      // Test the private method through public interface by creating a flow item
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'activity-1',
      ]);
      const eventEntity = createMockEventEntity(flow);

      const result = factory.createAvailableItem('test-applet', eventEntity);

      expect(result.activityId).toBe('activity-1');
      expect(result.name).toBe('Activity 1');
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should handle missing activity gracefully', () => {
      // Create flow with non-existent activity
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'missing-activity',
      ]);
      const eventEntity = createMockEventEntity(flow);

      const result = factory.createAvailableItem('test-applet', eventEntity);

      expect(result.activityId).toBe('missing-activity');
      expect(result.name).toBe('Unavailable Activity');
      expect(result.description).toContain(
        'This activity is no longer available',
      );
      expect(result.description).toContain('Flow: Test Flow');
      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[ListItemsFactory.safeGetActivity]: Activity not found - activityId=missing-activity',
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[ListItemsFactory.generatePlaceholderActivityData]: Generating placeholder for missing activity - activityId=missing-activity, flowName=Test Flow',
      );
    });
  });

  describe('populateActivityFlowFields', () => {
    it('should populate flow fields correctly for existing activities', () => {
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'activity-1',
        'activity-2',
      ]);
      const eventEntity = createMockEventEntity(flow);

      const result = factory.createAvailableItem('test-applet', eventEntity);

      expect(result.isInActivityFlow).toBe(true);
      expect(result.activityFlowDetails).toBeDefined();
      expect(result.activityFlowDetails?.activityFlowName).toBe('Test Flow');
      expect(result.activityFlowDetails?.numberOfActivitiesInFlow).toBe(2);
      expect(result.activityFlowDetails?.activityPositionInFlow).toBe(1);
      expect(result.activityFlowDetails?.showActivityFlowBadge).toBe(true);
    });

    it('should handle missing activity in flow with placeholder data', () => {
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'missing-activity',
      ]);
      const eventEntity = createMockEventEntity(flow);

      const result = factory.createAvailableItem('test-applet', eventEntity);

      expect(result.isInActivityFlow).toBe(true);
      expect(result.activityId).toBe('missing-activity');
      expect(result.name).toBe('Unavailable Activity');
      expect(result.description).toContain(
        'This activity is no longer available',
      );
      expect(result.image).toBeNull();
      expect(result.activityFlowDetails?.numberOfActivitiesInFlow).toBe(1);
    });

    it('should handle multiple missing activities in flow', () => {
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'missing-activity-1',
        'missing-activity-2',
      ]);
      const eventEntity = createMockEventEntity(flow);

      const result = factory.createAvailableItem('test-applet', eventEntity);

      expect(result.name).toBe('Unavailable Activity');
      expect(result.activityFlowDetails?.numberOfActivitiesInFlow).toBe(2);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[ListItemsFactory.safeGetActivity]: Activity not found - activityId=missing-activity-1',
      );
    });
  });

  describe('createAvailableItem', () => {
    it('should create available item for regular activity', () => {
      const activity = createMockActivity('activity-1', 'Test Activity');
      const eventEntity = createMockEventEntity(activity);

      const result = factory.createAvailableItem('test-applet', eventEntity);

      expect(result.activityId).toBe('activity-1');
      expect(result.name).toBe('Test Activity');
      expect(result.status).toBe(ActivityStatus.Available);
      expect(result.isInActivityFlow).toBe(false);
    });

    it('should create available item for activity flow with existing activities', () => {
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'activity-1',
      ]);
      const eventEntity = createMockEventEntity(flow);

      const result = factory.createAvailableItem('test-applet', eventEntity);

      expect(result.flowId).toBe('flow-1');
      expect(result.isInActivityFlow).toBe(true);
      expect(result.status).toBe(ActivityStatus.Available);
    });

    it('should create available item for activity flow with missing activities', () => {
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'missing-activity',
      ]);
      const eventEntity = createMockEventEntity(flow);

      const result = factory.createAvailableItem('test-applet', eventEntity);

      expect(result.flowId).toBe('flow-1');
      expect(result.isInActivityFlow).toBe(true);
      expect(result.status).toBe(ActivityStatus.Available);
      expect(result.name).toBe('Unavailable Activity');
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('createScheduledItem', () => {
    it('should create scheduled item for activity flow with missing activities', () => {
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'missing-activity',
      ]);
      const scheduledEvent = {
        ...createMockEvent('event-1', flow.id),
        availability: {
          ...createMockEvent('event-1', flow.id).availability,
          availabilityType: AvailabilityType.ScheduledAccess,
          timeFrom: { hours: 9, minutes: 0 },
          timeTo: { hours: 17, minutes: 0 },
        },
      };
      const eventEntity: EventEntity = {
        entity: flow,
        event: scheduledEvent,
        assignment: null,
      };

      const result = factory.createScheduledItem('test-applet', eventEntity);

      expect(result.status).toBe(ActivityStatus.Scheduled);
      expect(result.name).toBe('Unavailable Activity');
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('createProgressItem', () => {
    it('should create progress item for activity flow with missing activities', () => {
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'missing-activity',
      ]);
      const eventEntity = createMockEventEntity(flow);

      const result = factory.createProgressItem('test-applet', eventEntity);

      expect(result.status).toBe(ActivityStatus.InProgress);
      expect(result.name).toBe('Unavailable Activity');
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle empty activity flow gracefully', () => {
      const flow = createMockActivityFlow('flow-1', 'Empty Flow', []);
      const eventEntity = createMockEventEntity(flow);

      // This should not crash even with empty activity list
      const result = factory.createAvailableItem('test-applet', eventEntity);

      expect(result.isInActivityFlow).toBe(true);
      expect(result.activityFlowDetails?.numberOfActivitiesInFlow).toBe(0);
    });

    it('should handle null/undefined activity flow properties', () => {
      const flow: ActivityFlow = {
        ...createMockActivityFlow('flow-1', 'Test Flow'),
        activityIds: ['missing-activity'],
        name: '',
        description: '',
      };
      const eventEntity = createMockEventEntity(flow);

      const result = factory.createAvailableItem('test-applet', eventEntity);

      expect(result.name).toBe('Unavailable Activity');
      expect(result.description).toContain(
        'This activity is no longer available',
      );
    });

    it('should not crash when activities array is empty', () => {
      const emptyContext = createMockGroupsBuildContext([], 'test-applet');
      const emptyFactory = new ListItemsFactory(emptyContext, mockLogger);

      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'any-activity',
      ]);
      const eventEntity = createMockEventEntity(flow);

      const result = emptyFactory.createAvailableItem(
        'test-applet',
        eventEntity,
      );

      expect(result.name).toBe('Unavailable Activity');
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('generatePlaceholderActivityData', () => {
    it('should generate consistent placeholder data', () => {
      // Test through flow creation since the method is private
      const flow1 = createMockActivityFlow('flow-1', 'Flow One', ['missing-1']);
      const flow2 = createMockActivityFlow('flow-2', 'Flow Two', ['missing-2']);

      const eventEntity1 = createMockEventEntity(flow1);
      const eventEntity2 = createMockEventEntity(flow2);

      const result1 = factory.createAvailableItem('test-applet', eventEntity1);
      const result2 = factory.createAvailableItem('test-applet', eventEntity2);

      expect(result1.name).toBe('Unavailable Activity');
      expect(result2.name).toBe('Unavailable Activity');
      expect(result1.description).toContain('Flow: Flow One');
      expect(result2.description).toContain('Flow: Flow Two');
      expect(result1.activityId).toBe('missing-1');
      expect(result2.activityId).toBe('missing-2');
    });
  });

  describe('logging behavior', () => {
    it('should log warnings when activities are not found', () => {
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'missing-activity',
      ]);
      const eventEntity = createMockEventEntity(flow);

      factory.createAvailableItem('test-applet', eventEntity);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[ListItemsFactory.safeGetActivity]: Activity not found - activityId=missing-activity',
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[ListItemsFactory.generatePlaceholderActivityData]: Generating placeholder for missing activity - activityId=missing-activity, flowName=Test Flow',
      );
    });

    it('should log warnings for multiple missing activities', () => {
      const flow = createMockActivityFlow('flow-1', 'Test Flow', [
        'missing-activity-1',
        'missing-activity-2',
      ]);
      const eventEntity1 = createMockEventEntity(flow, 'event-1');
      const eventEntity2 = createMockEventEntity(flow, 'event-2');

      factory.createAvailableItem('test-applet', eventEntity1);
      factory.createAvailableItem('test-applet', eventEntity2);

      expect(mockLogger.warn).toHaveBeenCalledTimes(4); // 2 calls per flow (safeGet + placeholder)
    });
  });
});

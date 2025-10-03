import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import {
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { ActivityType } from '@app/entities/activity/lib/types/activityListItem';
import { ScheduleEvent } from '@app/entities/event/lib/types/event';
import { ILogger } from '@app/shared/lib/types/logger';

import {
  EntityReferenceValidator,
  createEntityReferenceValidator,
  EntityValidationContext,
  EntityValidationResult,
} from './EntityReferenceValidator';
import {
  Activity,
  ActivityFlow,
  EventEntity,
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

describe('EntityReferenceValidator', () => {
  let validator: EntityReferenceValidator;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = createMockLogger();
    validator = new EntityReferenceValidator(mockLogger);
  });

  describe('constructor and factory', () => {
    it('should create validator with logger', () => {
      expect(validator).toBeInstanceOf(EntityReferenceValidator);
    });

    it('should create validator using factory function', () => {
      const factoryValidator = createEntityReferenceValidator(mockLogger);
      expect(factoryValidator).toBeInstanceOf(EntityReferenceValidator);
    });
  });

  describe('validate - valid entity references', () => {
    it('should validate successfully when all activities exist', () => {
      // Arrange
      const activity1 = createMockActivity('activity-1', 'Activity 1');
      const activity2 = createMockActivity('activity-2', 'Activity 2');
      const eventEntity1 = createMockEventEntity(activity1, 'event-1');
      const eventEntity2 = createMockEventEntity(activity2, 'event-2');

      const context: EntityValidationContext = {
        eventEntities: [eventEntity1, eventEntity2],
        availableActivities: [activity1, activity2],
        availableFlows: [],
      };

      // Act
      const result = validator.validate(context);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.validEntities).toHaveLength(2);
      expect(result.staleReferences).toHaveLength(0);
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should validate successfully when all flows and their activities exist', () => {
      // Arrange
      const activity1 = createMockActivity('activity-1');
      const activity2 = createMockActivity('activity-2');
      const flow1 = createMockActivityFlow('flow-1', 'Flow 1', [
        'activity-1',
        'activity-2',
      ]);
      const eventEntity = createMockEventEntity(flow1, 'event-1');

      const context: EntityValidationContext = {
        eventEntities: [eventEntity],
        availableActivities: [activity1, activity2],
        availableFlows: [flow1],
      };

      // Act
      const result = validator.validate(context);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.validEntities).toHaveLength(1);
      expect(result.staleReferences).toHaveLength(0);
    });
  });

  describe('validate - invalid entity references', () => {
    it('should detect missing activity', () => {
      // Arrange
      const activity1 = createMockActivity('activity-1');
      const missingActivity = createMockActivity('missing-activity');
      const eventEntity1 = createMockEventEntity(activity1, 'event-1');
      const eventEntity2 = createMockEventEntity(missingActivity, 'event-2');

      const context: EntityValidationContext = {
        eventEntities: [eventEntity1, eventEntity2],
        availableActivities: [activity1], // missing-activity not included
        availableFlows: [],
      };

      // Act
      const result = validator.validate(context);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.validEntities).toHaveLength(1);
      expect(result.staleReferences).toHaveLength(1);
      expect(result.staleReferences[0]).toEqual({
        entityId: 'missing-activity',
        entityType: 'activity',
        eventId: 'event-2',
        reason: 'Activity not found in available activities',
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[EntityReferenceValidator.validate]: Activity not found - entityId=missing-activity, eventId=event-2',
      );
    });

    it('should detect missing activity flow', () => {
      // Arrange
      const flow1 = createMockActivityFlow('flow-1');
      const missingFlow = createMockActivityFlow('missing-flow');
      const eventEntity1 = createMockEventEntity(flow1, 'event-1');
      const eventEntity2 = createMockEventEntity(missingFlow, 'event-2');

      const context: EntityValidationContext = {
        eventEntities: [eventEntity1, eventEntity2],
        availableActivities: [],
        availableFlows: [flow1], // missing-flow not included
      };

      // Act
      const result = validator.validate(context);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.validEntities).toHaveLength(1);
      expect(result.staleReferences).toHaveLength(1);
      expect(result.staleReferences[0]).toEqual({
        entityId: 'missing-flow',
        entityType: 'flow',
        eventId: 'event-2',
        reason: 'Activity flow not found in available flows',
      });
    });

    it('should detect missing activities within a flow', () => {
      // Arrange
      const activity1 = createMockActivity('activity-1');
      const flow1 = createMockActivityFlow('flow-1', 'Flow 1', [
        'activity-1',
        'missing-activity',
      ]);
      const eventEntity = createMockEventEntity(flow1, 'event-1');

      const context: EntityValidationContext = {
        eventEntities: [eventEntity],
        availableActivities: [activity1], // missing-activity not included
        availableFlows: [flow1],
      };

      // Act
      const result = validator.validate(context);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.validEntities).toHaveLength(0);
      expect(result.staleReferences).toHaveLength(1);
      expect(result.staleReferences[0]).toEqual({
        entityId: 'flow-1',
        entityType: 'flow',
        eventId: 'event-1',
        reason: 'Activity flow contains deleted activities: missing-activity',
      });
    });
  });

  describe('validate - mixed scenarios', () => {
    it('should handle mix of valid and invalid entities', () => {
      // Arrange
      const validActivity = createMockActivity('valid-activity');
      const missingActivity = createMockActivity('missing-activity');
      const validFlow = createMockActivityFlow('valid-flow', 'Valid Flow', [
        'valid-activity',
      ]);
      const invalidFlow = createMockActivityFlow(
        'invalid-flow',
        'Invalid Flow',
        ['missing-activity'],
      );

      const eventEntities = [
        createMockEventEntity(validActivity, 'event-1'),
        createMockEventEntity(missingActivity, 'event-2'),
        createMockEventEntity(validFlow, 'event-3'),
        createMockEventEntity(invalidFlow, 'event-4'),
      ];

      const context: EntityValidationContext = {
        eventEntities,
        availableActivities: [validActivity],
        availableFlows: [validFlow, invalidFlow],
      };

      // Act
      const result = validator.validate(context);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.validEntities).toHaveLength(2); // valid activity and valid flow
      expect(result.staleReferences).toHaveLength(2); // missing activity and invalid flow
    });

    it('should handle empty arrays', () => {
      // Arrange
      const context: EntityValidationContext = {
        eventEntities: [],
        availableActivities: [],
        availableFlows: [],
      };

      // Act
      const result = validator.validate(context);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.validEntities).toHaveLength(0);
      expect(result.staleReferences).toHaveLength(0);
    });
  });

  describe('validateActivityReferences', () => {
    it('should validate all activities exist in flow', () => {
      // Arrange
      const activity1 = createMockActivity('activity-1');
      const activity2 = createMockActivity('activity-2');
      const flow = createMockActivityFlow('flow-1', 'Flow 1', [
        'activity-1',
        'activity-2',
      ]);

      // Act
      const result = validator.validateActivityReferences(flow, [
        activity1,
        activity2,
      ]);

      // Assert
      expect(result.validActivityIds).toEqual(['activity-1', 'activity-2']);
      expect(result.missingActivityIds).toHaveLength(0);
    });

    it('should detect missing activities in flow', () => {
      // Arrange
      const activity1 = createMockActivity('activity-1');
      const flow = createMockActivityFlow('flow-1', 'Flow 1', [
        'activity-1',
        'missing-activity-1',
        'missing-activity-2',
      ]);

      // Act
      const result = validator.validateActivityReferences(flow, [activity1]);

      // Assert
      expect(result.validActivityIds).toEqual(['activity-1']);
      expect(result.missingActivityIds).toEqual([
        'missing-activity-1',
        'missing-activity-2',
      ]);
      expect(mockLogger.warn).toHaveBeenCalledTimes(2);
    });

    it('should handle empty activity flow', () => {
      // Arrange
      const flow = createMockActivityFlow('flow-1', 'Empty Flow', []);

      // Act
      const result = validator.validateActivityReferences(flow, []);

      // Assert
      expect(result.validActivityIds).toHaveLength(0);
      expect(result.missingActivityIds).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should handle errors during validation gracefully', () => {
      // Arrange - Create a context that will cause an error
      const problematicEntity = {
        ...createMockActivity('problematic-entity'),
        pipelineType: 999 as any, // Invalid pipeline type
      };
      const eventEntity = createMockEventEntity(problematicEntity, 'event-1');

      const context: EntityValidationContext = {
        eventEntities: [eventEntity],
        availableActivities: [],
        availableFlows: [],
      };

      // Act
      const result = validator.validate(context);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.validEntities).toHaveLength(0);
      expect(result.staleReferences).toHaveLength(1);
      expect(result.staleReferences[0].reason).toContain(
        'Activity flow not found in available flows',
      );
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('logging behavior', () => {
    it('should log validation start and completion', () => {
      // Arrange
      const activity = createMockActivity('activity-1');
      const eventEntity = createMockEventEntity(activity, 'event-1');
      const context: EntityValidationContext = {
        eventEntities: [eventEntity],
        availableActivities: [activity],
        availableFlows: [],
      };

      // Act
      validator.validate(context);

      // Assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        '[EntityReferenceValidator.validate]: Starting entity reference validation',
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        '[EntityReferenceValidator.validate]: Validation complete - valid=1, stale=0',
      );
    });

    it('should log activity reference validation', () => {
      // Arrange
      const activity1 = createMockActivity('activity-1');
      const flow = createMockActivityFlow('flow-1', 'Flow 1', ['activity-1']);

      // Act
      validator.validateActivityReferences(flow, [activity1]);

      // Assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        '[EntityReferenceValidator.validateActivityReferences]: Validating flow activities - flowId=flow-1, activityCount=1',
      );
    });

    it('should log warnings for missing entities', () => {
      // Arrange
      const missingActivity = createMockActivity('missing-activity');
      const eventEntity = createMockEventEntity(missingActivity, 'event-1');
      const context: EntityValidationContext = {
        eventEntities: [eventEntity],
        availableActivities: [],
        availableFlows: [],
      };

      // Act
      validator.validate(context);

      // Assert
      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[EntityReferenceValidator.validate]: Activity not found - entityId=missing-activity, eventId=event-1',
      );
    });
  });
});

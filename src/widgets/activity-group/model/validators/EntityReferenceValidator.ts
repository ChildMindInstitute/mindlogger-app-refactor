import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import { ILogger } from '@app/shared/lib/types/logger';

import {
  Activity,
  ActivityFlow,
  EventEntity,
} from '../../lib/types/activityGroupsBuilder';

export type EntityValidationResult = {
  isValid: boolean;
  validEntities: EventEntity[];
  staleReferences: Array<{
    entityId: string;
    entityType: 'activity' | 'flow';
    eventId: string;
    reason: string;
  }>;
};

export type EntityValidationContext = {
  eventEntities: EventEntity[];
  availableActivities: Activity[];
  availableFlows: ActivityFlow[];
};

export interface IEntityReferenceValidator {
  validate(context: EntityValidationContext): EntityValidationResult;
  validateActivityReferences(
    activityFlow: ActivityFlow,
    availableActivities: Activity[],
  ): {
    validActivityIds: string[];
    missingActivityIds: string[];
  };
}

export class EntityReferenceValidator implements IEntityReferenceValidator {
  constructor(private logger: ILogger) {}

  /**
   * Validates all entity references in the provided context
   * @param context - The validation context containing entities and available resources
   * @returns Validation result with valid entities and stale references
   */
  validate(context: EntityValidationContext): EntityValidationResult {
    this.logger.log(
      '[EntityReferenceValidator.validate]: Starting entity reference validation',
    );

    const { eventEntities, availableActivities, availableFlows } = context;

    const validEntities: EventEntity[] = [];
    const staleReferences: EntityValidationResult['staleReferences'] = [];

    // Create lookup maps for efficient entity checking
    const activitiesById = this.createActivityLookupMap(availableActivities);
    const flowsById = this.createFlowLookupMap(availableFlows);

    for (const eventEntity of eventEntities) {
      const { entity, event } = eventEntity;

      try {
        // Validate the entity exists in available entities
        if (entity.pipelineType === ActivityPipelineType.Regular) {
          // Validate activity reference
          if (!activitiesById.has(entity.id)) {
            this.logger.warn(
              `[EntityReferenceValidator.validate]: Activity not found - entityId=${entity.id}, eventId=${event.id}`,
            );
            staleReferences.push({
              entityId: entity.id,
              entityType: 'activity',
              eventId: event.id,
              reason: 'Activity not found in available activities',
            });
            continue;
          }
        } else {
          // Validate activity flow reference
          // TypeScript should narrow this to ActivityFlow based on pipelineType check
          if (!flowsById.has(entity.id)) {
            this.logger.warn(
              `[EntityReferenceValidator.validate]: Activity flow not found - entityId=${entity.id}, eventId=${event.id}`,
            );
            staleReferences.push({
              entityId: entity.id,
              entityType: 'flow',
              eventId: event.id,
              reason: 'Activity flow not found in available flows',
            });
            continue;
          }

          // Validate activity references within the flow
          // Since pipelineType !== Regular, entity must be ActivityFlow
          const activityValidation = this.validateActivityReferences(
            entity,
            availableActivities,
          );

          if (activityValidation.missingActivityIds.length > 0) {
            this.logger.warn(
              `[EntityReferenceValidator.validate]: Activity flow has missing activities - flowId=${entity.id}, missing=${activityValidation.missingActivityIds.join(', ')}`,
            );
            staleReferences.push({
              entityId: entity.id,
              entityType: 'flow',
              eventId: event.id,
              reason: `Activity flow contains deleted activities: ${activityValidation.missingActivityIds.join(', ')}`,
            });
            continue;
          }
        }

        // If we reach here, the entity is valid
        validEntities.push(eventEntity);
      } catch (error) {
        this.logger.warn(
          `[EntityReferenceValidator.validate]: Error validating entity - entityId=${entity.id}, error=${error}`,
        );
        staleReferences.push({
          entityId: entity.id,
          entityType:
            entity.pipelineType === ActivityPipelineType.Regular
              ? 'activity'
              : 'flow',
          eventId: event.id,
          reason: `Validation error: ${error}`,
        });
      }
    }

    const result: EntityValidationResult = {
      isValid: staleReferences.length === 0,
      validEntities,
      staleReferences,
    };

    this.logger.log(
      `[EntityReferenceValidator.validate]: Validation complete - valid=${validEntities.length}, stale=${staleReferences.length}`,
    );

    return result;
  }

  /**
   * Validates that all activity references within a flow exist in available activities
   * @param activityFlow - The activity flow to validate
   * @param availableActivities - Available activities to check against
   * @returns Validation result with valid and missing activity IDs
   */
  validateActivityReferences(
    activityFlow: ActivityFlow,
    availableActivities: Activity[],
  ): {
    validActivityIds: string[];
    missingActivityIds: string[];
  } {
    this.logger.log(
      `[EntityReferenceValidator.validateActivityReferences]: Validating flow activities - flowId=${activityFlow.id}, activityCount=${activityFlow.activityIds.length}`,
    );

    const activitiesById = this.createActivityLookupMap(availableActivities);
    const validActivityIds: string[] = [];
    const missingActivityIds: string[] = [];

    for (const activityId of activityFlow.activityIds) {
      if (activitiesById.has(activityId)) {
        validActivityIds.push(activityId);
      } else {
        missingActivityIds.push(activityId);
        this.logger.warn(
          `[EntityReferenceValidator.validateActivityReferences]: Missing activity in flow - flowId=${activityFlow.id}, activityId=${activityId}`,
        );
      }
    }

    return {
      validActivityIds,
      missingActivityIds,
    };
  }

  /**
   * Creates a Set-based lookup map for activities for O(1) access
   * @param activities - Array of activities
   * @returns Set of activity IDs
   */
  private createActivityLookupMap(activities: Activity[]): Set<string> {
    return new Set(activities.map(activity => activity.id));
  }

  /**
   * Creates a Set-based lookup map for flows for O(1) access
   * @param flows - Array of activity flows
   * @returns Set of flow IDs
   */
  private createFlowLookupMap(flows: ActivityFlow[]): Set<string> {
    return new Set(flows.map(flow => flow.id));
  }
}

/**
 * Factory function to create EntityReferenceValidator instance
 * @param logger - Logger instance for logging validation activities
 * @returns New EntityReferenceValidator instance
 */
export const createEntityReferenceValidator = (
  logger: ILogger,
): IEntityReferenceValidator => {
  return new EntityReferenceValidator(logger);
};

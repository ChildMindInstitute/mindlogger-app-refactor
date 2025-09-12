import { QueryClient } from '@tanstack/react-query';

import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import { EntityProgression } from '@app/abstract/lib/types/entityProgress';
import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import { ScheduleEvent } from '@app/entities/event/lib/types/event';
import { mapEventsFromDto } from '@app/entities/event/model/mappers';
import { IScheduledDateCalculator } from '@app/entities/event/model/operations/IScheduledDateCalculator';
import {
  AppletAssignmentsResponse,
  AppletDetailsResponse,
} from '@app/shared/api/services/IAppletService';
import { AppletEventsResponse } from '@app/shared/api/services/IEventsService';
import { IFeatureFlagsService } from '@app/shared/lib/featureFlags/IFeatureFlagsService';
import { ILogger } from '@app/shared/lib/types/logger';
import {
  getDataFromQuery,
  getAppletDetailsKey,
  getAssignmentsKey,
  getEventsKey,
} from '@app/shared/lib/utils/reactQueryHelpers';

import {
  BuildResult,
  IActivityGroupsBuildManager,
} from './IActivityGroupsBuildManager';
import {
  Activity,
  ActivityFlow,
  Entity,
  EventEntity,
} from '../../lib/types/activityGroupsBuilder';
import { createActivityGroupsBuilder } from '../factories/ActivityGroupsBuilder';
import {
  mapActivitiesFromDto,
  mapActivityFlowsFromDto,
  mapAssignmentsFromDto,
} from '../mappers';
import {
  createEntityReferenceValidator,
  EntityValidationContext,
} from '../validators/EntityReferenceValidator';

export const createActivityGroupsBuildManager = (
  logger: ILogger,
  scheduledDateCalculator: IScheduledDateCalculator,
  featureFlagsService: IFeatureFlagsService,
): IActivityGroupsBuildManager => {
  const buildIdToEntityMap = (
    activities: Activity[],
    activityFlows: ActivityFlow[],
  ): Record<string, Entity> => {
    return [...activities, ...activityFlows].reduce<Record<string, Entity>>(
      (acc, current) => {
        acc[current.id] = current;
        return acc;
      },
      {},
    );
  };

  const sortEntityEvents = (eventEntities: EventEntity[]): EventEntity[] => {
    // Array.prototype.sort both sorts the array in-place, and returning
    // a reference to that array itself.
    return eventEntities.sort((a, b) => {
      const aIsFlow = a.entity.pipelineType === ActivityPipelineType.Flow;
      const bIsFlow = b.entity.pipelineType === ActivityPipelineType.Flow;

      // 1. Sort activity flows above activities
      if (aIsFlow && !bIsFlow) {
        return -1;
      } else if (!aIsFlow && bIsFlow) {
        return 1;
      }

      // 2. Sort by entity order
      const orderDiff = a.entity.order - b.entity.order;
      if (orderDiff !== 0) {
        return orderDiff;
      }

      // 3. Sort self-report above assigned entities
      if (!a.assignment) {
        return -1;
      } else if (!b.assignment) {
        return 1;
      }

      // 4. Sort by assignment target subject's first name
      const firstNameDiff =
        `${a.assignment.target.firstName || ''}`.localeCompare(
          `${b.assignment.target.firstName || ''}`,
        );
      if (firstNameDiff !== 0) {
        return firstNameDiff;
      }

      // 5. Sort by assignment target subject's last name
      const lastnameDiff =
        `${a.assignment.target.lastName || ''}`.localeCompare(
          `${b.assignment.target.lastName || ''}`,
        );
      if (lastnameDiff !== 0) {
        return lastnameDiff;
      }

      return 0;
    });
  };

  const processInternal = (
    appletId: string,
    entityProgressions: EntityProgression[],
    queryClient: QueryClient,
  ): BuildResult => {
    const appletResponse = getDataFromQuery<AppletDetailsResponse>(
      getAppletDetailsKey(appletId),
      queryClient,
    );
    if (!appletResponse) {
      logger.warn(
        `[ActivityGroupsBuildManager.processInternal]: appletResponse not found, appletId=${appletId}`,
      );
      return { groups: [], isCacheInsufficientError: true };
    }

    logger.log(
      `[ActivityGroupsBuildManager.processInternal]: Applet is "${appletId}|${appletResponse.result.displayName}"`,
    );

    const activities: Activity[] = mapActivitiesFromDto(
      appletResponse.result.activities,
    );

    const activityFlows: ActivityFlow[] = mapActivityFlowsFromDto(
      appletResponse.result.activityFlows,
    );

    const assignmentsResponse = getDataFromQuery<AppletAssignmentsResponse>(
      getAssignmentsKey(appletId),
      queryClient,
    );
    const assignments: Assignment[] = assignmentsResponse
      ? mapAssignmentsFromDto(assignmentsResponse.result.assignments)
      : [];

    const eventsResponse = getDataFromQuery<AppletEventsResponse>(
      getEventsKey(appletId),
      queryClient,
    );
    if (!eventsResponse) {
      logger.warn(
        '[ActivityGroupsBuildManager.processInternal]: eventsResponse not found',
      );
      return { groups: [], isCacheInsufficientError: true };
    }

    const events: ScheduleEvent[] = mapEventsFromDto(
      eventsResponse.result.events,
    );

    const entitiesById = buildIdToEntityMap(activities, activityFlows);

    // Create entity reference validator to check for stale references
    const entityValidator = createEntityReferenceValidator(logger);

    const entityEvents: EventEntity[] = [];
    for (const event of events) {
      const entity = entitiesById[event.entityId];
      if (!entity || entity.isHidden) {
        continue;
      }

      event.scheduledAt = scheduledDateCalculator.calculate(event);
      if (!event.scheduledAt) {
        logger.info(
          `[ScheduledDateCalculator.calculate]: result is null, entity|event = "${entity.name}|${event.id}"`,
        );
        continue;
      }

      let entityAssignments: Assignment[];
      if (entity.pipelineType === ActivityPipelineType.Flow) {
        entityAssignments = assignments.filter(
          _assignment =>
            _assignment.__type === 'activityFlow' &&
            _assignment.activityFlowId === entity.id,
        );
      } else {
        entityAssignments = assignments.filter(
          _assignment =>
            _assignment.__type === 'activity' &&
            _assignment.activityId === entity.id,
        );
      }

      // If the entity is auto-assigned, always include an entry for it.
      if (entity.autoAssign) {
        entityEvents.push({ entity, event, assignment: null });
      }

      for (const assignment of entityAssignments) {
        const isSelfAssign = assignment.target.id === assignment.respondent.id;

        if (entity.autoAssign) {
          if (isSelfAssign) {
            // Skip entities that are both auto-assign and self-assigned
            // to avoid duplicating the auto-assign entry above.
          } else {
            // Include entities that are auto-assign and have manual
            // assignment for someone else.
            entityEvents.push({ entity, event, assignment });
          }
        } else {
          if (isSelfAssign) {
            // Include entities that are manual-assign and self-assigned.
            entityEvents.push({ entity, event, assignment: null });
          } else {
            // Include entities that are manual-assigned to someone else.
            entityEvents.push({ entity, event, assignment });
          }
        }
      }
    }

    // Validate entity references before processing
    const validationContext: EntityValidationContext = {
      eventEntities: entityEvents,
      availableActivities: activities,
      availableFlows: activityFlows,
    };

    const validationResult = entityValidator.validate(validationContext);

    if (validationResult.staleReferences.length > 0) {
      logger.warn(
        `[ActivityGroupsBuildManager.processInternal]: Found ${validationResult.staleReferences.length} stale entity references`,
      );

      // Log details of stale references
      validationResult.staleReferences.forEach(ref => {
        logger.warn(
          `[ActivityGroupsBuildManager.processInternal]: Stale reference - entityId=${ref.entityId}, type=${ref.entityType}, reason=${ref.reason}`,
        );
      });

      // If validation fails, mark cache as insufficient to trigger refresh
      if (!validationResult.isValid) {
        logger.warn(
          '[ActivityGroupsBuildManager.processInternal]: Entity validation failed, marking cache as insufficient',
        );
        return { groups: [], isCacheInsufficientError: true };
      }
    }

    // Use only valid entities for processing
    const validEntityEvents = validationResult.validEntities;
    const sortedEntityEvents = sortEntityEvents(validEntityEvents);

    logger.log(
      `[ActivityGroupsBuildManager.processInternal]: Processing ${sortedEntityEvents.length} valid entities (filtered from ${entityEvents.length} total)`,
    );

    let logInfo = '';
    const result: BuildResult = { groups: [] };
    const builder = createActivityGroupsBuilder(
      {
        allAppletActivities: activities,
        appletId: appletId,
        entityProgressions,
      },
      logger,
    );

    try {
      logInfo = 'building in-progress';
      result.groups.push(builder.buildInProgress(appletId, sortedEntityEvents));

      logInfo = 'building available';
      result.groups.push(builder.buildAvailable(appletId, sortedEntityEvents));

      logInfo = 'building scheduled';
      result.groups.push(builder.buildScheduled(appletId, sortedEntityEvents));
    } catch (error) {
      logger.warn(
        `[ActivityGroupsBuildManager.processInternal]: Build error occurred while ${logInfo}:\n\n${error}`,
      );
      result.otherError = true;
    }

    return result;
  };

  const process = (
    appletId: string,
    entityProgressions: EntityProgression[],
    queryClient: QueryClient,
  ): BuildResult => {
    try {
      logger.log('[ActivityGroupsBuildManager.process]: Building groups..');

      const result = processInternal(appletId, entityProgressions, queryClient);

      logger.log('[ActivityGroupsBuildManager.process]: Build is done');

      return result;
    } catch (error) {
      logger.warn(
        `[ActivityGroupsBuildManager.process] Error occurred\nInternal error:\n${error}`,
      );
      return { groups: [], otherError: true };
    }
  };

  return {
    process,
  };
};

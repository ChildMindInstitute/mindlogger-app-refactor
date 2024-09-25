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

export const createActivityGroupsBuildManager = (
  logger: ILogger,
  scheduledDateCalculator: IScheduledDateCalculator,
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

  const sort = (eventEntities: EventEntity[]) => {
    let flows = eventEntities.filter(
      x => x.entity.pipelineType === ActivityPipelineType.Flow,
    );
    let activities = eventEntities.filter(
      x => x.entity.pipelineType === ActivityPipelineType.Regular,
    );

    flows = flows.sort((a, b) => a.entity.order - b.entity.order);
    activities = activities.sort((a, b) => a.entity.order - b.entity.order);

    return [...flows, ...activities];
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

    const idToEntity = buildIdToEntityMap(activities, activityFlows);

    const entityEvents = events
      .reduce((acc, event) => {
        const entity = idToEntity[event.entityId];

        if (entity) {
          let entityAssignments: Assignment[] = [];
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
          if (entityAssignments.length <= 0) {
            acc.push({ entity, event, assignment: null });
          } else {
            for (const assignment of entityAssignments) {
              acc.push({ entity, event, assignment });
            }
          }
        }

        return acc;
      }, [] as EventEntity[])
      .map(entityEvent => {
        const date = scheduledDateCalculator.calculate(entityEvent.event);
        entityEvent.event.scheduledAt = date;

        if (!date) {
          logger.info(
            `[ScheduledDateCalculator.calculate]: result is null, entity|event = "${entityEvent.entity.name}|${entityEvent.event.id}"`,
          );
        }

        return entityEvent;
      })
      .filter(x => x.event.scheduledAt)
      .filter(x => !x.entity.isHidden);

    const result: BuildResult = { groups: [] };
    const builder = createActivityGroupsBuilder({
      allAppletActivities: activities,
      appletId: appletId,
      entityProgressions,
    });
    const sortedEntityEvents = sort(entityEvents);

    let logInfo = '';
    try {
      logInfo = 'building in-progress';
      result.groups.push(builder.buildInProgress(appletId, sortedEntityEvents));

      logInfo = 'building available';
      result.groups.push(builder.buildAvailable(appletId, sortedEntityEvents));

      logInfo = 'building scheduled';
      result.groups.push(builder.buildScheduled(appletId, sortedEntityEvents));
    } catch (error) {
      logger.warn(
        `[ActivityGroupsBuildManager.processInternal]: Build error occurred while ${logInfo}:\n\n${error as never}`,
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
        `[ActivityGroupsBuildManager.process] Error occurred\nInternal error:\n${error as never}`,
      );
      return { groups: [], otherError: true };
    }
  };

  return {
    process,
  };
};

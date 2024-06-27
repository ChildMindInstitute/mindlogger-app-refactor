import { QueryClient } from '@tanstack/react-query';

import {
  ActivityPipelineType,
  StoreProgress,
  convertProgress,
} from '@app/abstract/lib';
import { EventModel, ScheduleEvent } from '@app/entities/event';
import { mapEventsFromDto } from '@app/entities/event/model/mappers';
import { AppletDetailsResponse, AppletEventsResponse } from '@app/shared/api';
import {
  ILogger,
  Logger,
  getAppletDetailsKey,
  getDataFromQuery,
  getEventsKey,
} from '@app/shared/lib';

import {
  Activity,
  ActivityFlow,
  ActivityListGroup,
  Entity,
  EventEntity,
} from '../../lib';
import { createActivityGroupsBuilder } from '../factories/ActivityGroupsBuilder';
import { mapActivitiesFromDto, mapActivityFlowsFromDto } from '../mappers';

type BuildResult = {
  groups: ActivityListGroup[];
  isCacheInsufficientError?: boolean;
  otherError?: boolean;
};

const createActivityGroupsBuildManager = (logger: ILogger) => {
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
    entitiesProgress: StoreProgress,
    queryClient: QueryClient,
  ): BuildResult => {
    const appletResponse = getDataFromQuery<AppletDetailsResponse>(
      getAppletDetailsKey(appletId),
      queryClient,
    )!;

    if (!appletResponse) {
      logger.warn(
        `[ActivityGroupsBuildManager.processInternal]: appletResponse not found, appletId=${appletId}`,
      );
      return { groups: [], isCacheInsufficientError: true };
    }

    const activities: Activity[] = mapActivitiesFromDto(
      appletResponse.result.activities,
    );

    const activityFlows: ActivityFlow[] = mapActivityFlowsFromDto(
      appletResponse.result.activityFlows,
    );

    const eventsResponse = getDataFromQuery<AppletEventsResponse>(
      getEventsKey(appletId),
      queryClient,
    )!;

    logger.log(
      `[ActivityGroupsBuildManager.processInternal]: Applet is "${appletId}|${appletResponse.result.displayName}"`,
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

    const builder = createActivityGroupsBuilder({
      allAppletActivities: activities,
      appletId: appletId,
      progress: convertProgress(entitiesProgress),
    });

    let entityEvents = events
      .map<EventEntity>(event => ({
        entity: idToEntity[event.entityId],
        event,
      }))
      // @todo - remove after fix on BE
      .filter(entityEvent => !!entityEvent.entity);

    const calculator = EventModel.ScheduledDateCalculator;

    for (const eventActivity of entityEvents) {
      const date = calculator.calculate(eventActivity.event);
      eventActivity.event.scheduledAt = date;

      if (!date) {
        logger.info(
          `[ScheduledDateCalculator.calculate]: result is null, entity|event = "${eventActivity.entity.name}|${eventActivity.event.id}"`,
        );
      }
    }

    entityEvents = entityEvents.filter(x => x.event.scheduledAt);

    entityEvents = entityEvents.filter(x => !x.entity.isHidden);

    entityEvents = sort(entityEvents);

    const result: BuildResult = { groups: [] };
    let logInfo = '';

    try {
      logInfo = 'building in-progress';
      result.groups.push(builder.buildInProgress(entityEvents));

      logInfo = 'building available';
      result.groups.push(builder.buildAvailable(entityEvents));

      logInfo = 'building scheduled';
      result.groups.push(builder.buildScheduled(entityEvents));
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
    entitiesProgress: StoreProgress,
    queryClient: QueryClient,
  ): BuildResult => {
    try {
      logger.log('[ActivityGroupsBuildManager.process]: Building groups..');

      const result = processInternal(appletId, entitiesProgress, queryClient);

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

export default createActivityGroupsBuildManager(Logger);

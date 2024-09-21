import { QueryClient } from '@tanstack/react-query';

import {
  ActivityPipelineType,
  EntityProgression,
  EntityResponseTime,
} from '@app/abstract/lib';
import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import { AppletModel } from '@app/entities/applet';
import { EventModel } from '@app/entities/event';
import {
  AppletAssignmentsResponse,
  AppletDetailsResponse,
  AppletDto,
  AppletEventsResponse,
  AppletsResponse,
  LogAction,
  LogTrigger,
} from '@app/shared/api';
import {
  ILogger,
  Logger,
  getAppletDetailsKey,
  getAppletsKey,
  getAssignmentsKey,
  getDataFromQuery,
  getEventsKey,
} from '@app/shared/lib';
import { mapAssignmentsFromDto } from '@app/widgets/activity-group/model/mappers';

import { createNotificationBuilder } from './factory';
import {
  mapActivitiesFromDto,
  mapActivityFlowsFromDto,
  mapEventsFromDto,
} from './mappers';
import NotificationManager from './NotificationManager';
import {
  Activity,
  ActivityFlow,
  AppletNotificationDescribers,
  Entity,
  EventEntity,
  NotificationDescriber,
  ScheduleEvent,
  filterNotifications,
  sortNotificationDescribers,
} from '../lib';
import NotificationsLogger from '../lib/services/NotificationsLogger';

type NotificationRefreshService = {
  refresh: (
    queryClient: QueryClient,
    progressions: EntityProgression[],
    responseTimes: EntityResponseTime[],
    logTrigger: LogTrigger,
  ) => Promise<void>;
};

const createNotificationRefreshService = (
  logger: ILogger,
): NotificationRefreshService => {
  const buildIdToEntityMap = (entities: Entity[]): Record<string, Entity> => {
    return entities.reduce<Record<string, Entity>>((acc, current) => {
      acc[current.id] = current;
      return acc;
    }, {});
  };

  const refreshInternal = async (
    queryClient: QueryClient,
    progressions: EntityProgression[],
    responseTimes: EntityResponseTime[],
  ): Promise<AppletNotificationDescribers[]> => {
    const result: Array<AppletNotificationDescribers> = [];

    const appletsResponse = getDataFromQuery<AppletsResponse>(
      getAppletsKey(),
      queryClient,
    )!;

    if (!appletsResponse) {
      logger.warn(
        '[NotificationRefreshService.refreshInternal] Cannot to build notifications as appletsResponse is absent in the cache',
      );
      return result;
    }

    const appletDtos: AppletDto[] = appletsResponse.result;

    const applets = appletDtos.map(x => ({
      id: x.id,
      name: x.displayName,
    }));

    const allNotificationDescribers: NotificationDescriber[] = [];

    for (const applet of applets) {
      const detailsResponse = getDataFromQuery<AppletDetailsResponse>(
        getAppletDetailsKey(applet.id),
        queryClient,
      );

      const eventsResponse = getDataFromQuery<AppletEventsResponse>(
        getEventsKey(applet.id),
        queryClient,
      );

      const assignmentsResponse = getDataFromQuery<AppletAssignmentsResponse>(
        getAssignmentsKey(applet.id),
        queryClient,
      );

      if (!detailsResponse || !eventsResponse || !assignmentsResponse) {
        logger.info(
          `[NotificationRefreshService.refreshInternal] Notifications cannot be build for the applet "${applet.name}|${applet.id}" as required data is missing in the cache`,
        );
        continue;
      }

      const events: ScheduleEvent[] = mapEventsFromDto(
        eventsResponse.result.events,
      );

      const assignments = mapAssignmentsFromDto(
        assignmentsResponse.result.assignments,
      );

      const activities: Activity[] = mapActivitiesFromDto(
        detailsResponse.result.activities,
      );

      const activityFlows: ActivityFlow[] = mapActivityFlowsFromDto(
        detailsResponse.result.activityFlows,
      );

      const entities: Entity[] = [...activities, ...activityFlows];
      const idToEntity = buildIdToEntityMap(entities);

      let entityEvents = events.reduce((acc, event) => {
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
      }, [] as EventEntity[]);

      if (entityEvents.some(x => x.entity === null)) {
        logger.log(
          `[NotificationRefreshService.refreshInternal] Discovered event(s) for applet "${applet.name}|${applet.id}" that referenced to a missing entity`,
        );
        entityEvents = entityEvents.filter(x => x.entity !== null);
      }

      const calculator = EventModel.ScheduledDateCalculator;

      for (const eventEntity of entityEvents) {
        const date = calculator.calculate(eventEntity.event);
        eventEntity.event.scheduledAt = date;
      }

      const builder = createNotificationBuilder({
        appletId: applet.id,
        appletName: applet.name,
        eventEntities: entityEvents,
        progressions,
        responseTimes,
      });

      const appletNotifications: AppletNotificationDescribers = builder.build();

      result.push(appletNotifications);

      const filteredNotificationsArray: NotificationDescriber[] =
        filterNotifications(appletNotifications);

      allNotificationDescribers.push(...filteredNotificationsArray);
    }

    const sortedNotificationDescribers = sortNotificationDescribers(
      allNotificationDescribers,
    );

    await NotificationManager.scheduleNotifications(
      sortedNotificationDescribers,
    );

    return result;
  };

  const refresh = async (
    queryClient: QueryClient,
    progressions: EntityProgression[],
    responseTimes: EntityResponseTime[],
    logTrigger: LogTrigger,
  ) => {
    logger.info(
      '[NotificationRefreshService.refresh]: Start notifications refresh process',
    );

    if (NotificationManager.mutex.isBusy()) {
      logger.info(
        '[NotificationRefreshService.refresh]: Break as mutex set to busy',
      );
      return;
    }
    if (AppletModel.RefreshService.isBusy()) {
      logger.info(
        '[NotificationRefreshService.refresh]: RefreshService.mutex set to busy state',
      );
      return;
    }

    let describers: AppletNotificationDescribers[] | null = null;

    try {
      NotificationManager.mutex.setBusy();

      describers = await refreshInternal(
        queryClient,
        progressions,
        responseTimes,
      );

      logger.info(
        '[NotificationRefreshService.refresh]: Completed. Notifications rescheduled',
      );
    } catch (error) {
      logger.log(
        `[NotificationRefreshService.refresh]: Notifications rescheduling failed\n\n${error}`,
      );
    } finally {
      NotificationManager.mutex.release();
    }

    if (describers) {
      await NotificationsLogger.log({
        trigger: logTrigger,
        notificationDescriptions: describers,
        action: LogAction.ReSchedule,
      });
    }
  };

  const result: NotificationRefreshService = {
    refresh,
  };

  return result;
};

export default createNotificationRefreshService(Logger);

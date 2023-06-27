import { QueryClient } from '@tanstack/react-query';

import { StoreProgress, convertProgress } from '@app/abstract/lib';
import { EventModel } from '@app/entities/event';
import {
  AppletDetailsResponse,
  AppletDto,
  AppletEventsResponse,
  AppletsResponse,
  LogAction,
  LogTrigger,
} from '@app/shared/api';
import {
  getAppletDetailsKey,
  getAppletsKey,
  getDataFromQuery,
  getEventsKey,
} from '@app/shared/lib';

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
    storeProgress: StoreProgress,
    logTrigger: LogTrigger,
  ) => void;
};

const createNotificationRefreshService = (): NotificationRefreshService => {
  const buildIdToEntityMap = (entities: Entity[]): Record<string, Entity> => {
    return entities.reduce<Record<string, Entity>>((acc, current) => {
      acc[current.id] = current;
      return acc;
    }, {});
  };

  const refreshInternal = async (
    queryClient: QueryClient,
    storeProgress: StoreProgress,
  ): Promise<AppletNotificationDescribers[]> => {
    const result: Array<AppletNotificationDescribers> = [];

    const appletsResponse = getDataFromQuery<AppletsResponse>(
      getAppletsKey(),
      queryClient,
    )!;

    const progress = convertProgress(storeProgress);

    const appletDtos: AppletDto[] = appletsResponse.result;

    const applets = appletDtos.map(x => ({
      id: x.id,
      name: x.displayName,
    }));

    const allNotificationDescribers: NotificationDescriber[] = [];

    for (let applet of applets) {
      const detailsResponse = getDataFromQuery<AppletDetailsResponse>(
        getAppletDetailsKey(applet.id),
        queryClient,
      )!;

      const eventsResponse = getDataFromQuery<AppletEventsResponse>(
        getEventsKey(applet.id),
        queryClient,
      )!;

      const events: ScheduleEvent[] = mapEventsFromDto(
        eventsResponse.result.events,
      );

      const activities: Activity[] = mapActivitiesFromDto(
        detailsResponse.result.activities,
      );

      const activityFlows: ActivityFlow[] = mapActivityFlowsFromDto(
        detailsResponse.result.activityFlows,
      );

      const entities: Entity[] = [...activities, ...activityFlows];

      const idToEntity = buildIdToEntityMap(entities);

      let entityEvents = events.map<EventEntity>(event => ({
        entity: idToEntity[event.entityId],
        event,
      }));

      const calculator = EventModel.ScheduledDateCalculator;

      for (let eventEntity of entityEvents) {
        const date = calculator.calculate(eventEntity.event);
        eventEntity.event.scheduledAt = date;
      }

      const builder = createNotificationBuilder({
        appletId: applet.id,
        appletName: applet.name,
        eventEntities: entityEvents,
        progress,
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
    storeProgress: StoreProgress,
    logTrigger: LogTrigger,
  ) => {
    if (NotificationManager.mutex.isBusy()) {
      return;
    }

    try {
      NotificationManager.mutex.setBusy();

      const describers = await refreshInternal(queryClient, storeProgress);

      NotificationsLogger.log({
        trigger: logTrigger,
        notificationDescriptions: describers,
        action: LogAction.ReSchedule,
      });

      console.info(
        '[NotificationRefreshService.refresh]: Notifications rescheduled',
      );
    } catch (error) {
      console.log(
        '[NotificationRefreshService.refresh]: Notifications rescheduling failed',
        error,
      );
    } finally {
      NotificationManager.mutex.release();
    }
  };

  const result: NotificationRefreshService = {
    refresh,
  };

  return result;
};

export default createNotificationRefreshService();

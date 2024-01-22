import {
  ActivityPipelineType,
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib';
import {
  EventEntity,
  NotificationDescriber,
  NotificationType,
  ScheduleEvent,
} from '@app/entities/notification/lib';

import { createNotificationBuilder } from '../NotificationBuilder';

export const getEmptyEvent = (): ScheduleEvent => {
  return {
    entityId: 'mock-entity-id',
    id: 'mock-event-id',
    scheduledAt: null,
    selectedDate: null,
    notificationSettings: {
      notifications: [],
      reminder: null,
    },
    availability: {
      allowAccessBeforeFromTime: false,
      availabilityType: AvailabilityType.NotDefined,
      periodicityType: PeriodicityType.NotDefined,
      oneTimeCompletion: false,
      endDate: null,
      startDate: null,
      timeFrom: null,
      timeTo: null,
    },
  };
};

export const getEventEntity = (event: ScheduleEvent): EventEntity => {
  return {
    event,
    entity: {
      description: 'mock-entity-description',
      name: 'mock-entity-name',
      id: 'mock-entity-id',
      isVisible: true,
      pipelineType: ActivityPipelineType.Regular,
    },
  };
};

export const createBuilder = (eventEntity: EventEntity) => {
  return createNotificationBuilder({
    appletId: 'mock-applet-id',
    appletName: 'mock-applet-name',
    completions: {},
    eventEntities: [eventEntity],
    progress: {},
  });
};

export const getMockNotificationPattern = () => {
  return {
    activityFlowId: null,
    activityId: 'mock-entity-id',
    appletId: 'mock-applet-id',
    entityName: 'mock-entity-name',
    eventDayString: undefined,
    eventId: 'mock-event-id',
    fallType: undefined,
    isActive: true,
    isSpreadInEventSet: false,
    notificationBody: undefined,
    notificationHeader: 'mock-entity-name',
    notificationId: undefined,
    scheduledAt: undefined,
    scheduledAtString: undefined,
    shortId: undefined,
    type: NotificationType.NotDefined,
  } as unknown as NotificationDescriber;
};

import { addDays, addMonths, subMonths } from 'date-fns';

import {
  AvailabilityType,
  NotificationTriggerType,
  PeriodicityType,
} from '@app/abstract/lib';
import {
  NotificationDescriber,
  NotificationType,
  ScheduleEvent,
} from '@app/entities/notification/lib';
import { MINUTES_IN_HOUR, MS_IN_MINUTE } from '@app/shared/lib';

import { createBuilder, getEmptyEvent, getEventEntity } from './testHelpers';
import { INotificationBuilder } from '../NotificationBuilder';

const mockUtilityProps = (
  builder: INotificationBuilder,
  now: Date,
  setTime = true,
) => {
  const date = new Date(now);

  if (setTime) {
    date.setHours(15);
    date.setMinutes(30);
  }

  //@ts-ignore
  builder.utility.now = date;

  //@ts-ignore
  builder.utility.isCompleted = jest.fn().mockReturnValue(false);
};

const FixedHourAt = 16;
const FixedMinuteAt = 45;

const setNormalSettingsToEvent = (
  event: ScheduleEvent,
  periodicityType: PeriodicityType,
  today: Date,
  setReminder = false,
  fixed = true,
) => {
  event.availability.timeFrom =
    periodicityType === PeriodicityType.Always
      ? { hours: 0, minutes: 0 }
      : { hours: 15, minutes: 30 };
  event.availability.timeTo =
    periodicityType === PeriodicityType.Always
      ? { hours: 23, minutes: 59 }
      : { hours: 20, minutes: 15 };
  event.availability.availabilityType =
    periodicityType === PeriodicityType.Always
      ? AvailabilityType.AlwaysAvailable
      : AvailabilityType.ScheduledAccess;
  event.availability.periodicityType = periodicityType;
  event.availability.startDate = subMonths(today, 1);
  event.availability.endDate = addMonths(today, 1);
  event.notificationSettings.notifications.push({
    at: fixed ? { hours: FixedHourAt, minutes: FixedMinuteAt } : null,
    triggerType: fixed
      ? NotificationTriggerType.FIXED
      : NotificationTriggerType.RANDOM,
    from: null,
    to: null,
  });
  if (setReminder) {
    event.notificationSettings.reminder = {
      activityIncomplete: 1,
      reminderTime: { hours: 18, minutes: 25 },
    };
  }
};

const getMockNotification = (index = 1) => {
  const result: NotificationDescriber = {
    activityFlowId: null,
    activityId: 'mock-entity-id',
    appletId: 'mock-applet-id',
    entityName: 'mock-entity-name',
    eventId: 'mock-event-id',
    isActive: true,
    notificationBody: 'mock-notification-body',
    notificationHeader: 'mock-notification-header',
    notificationId: 'mock-notification-id' + index,
    scheduledAt: undefined,
    scheduledAtString: undefined,
    shortId: 'mock-shortId' + index,
    type: NotificationType.Regular,
  } as unknown as NotificationDescriber;
  return result;
};

describe('NotificationBuilder: processEventDay tests', () => {
  describe('Test Fixed notifications', () => {
    it('Should return notification scheduled for the event day when cross day is not set', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.NotDefined, today);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const markCompletedMock = jest.fn();
      const markOutdatedMock = jest.fn();
      //@ts-ignore
      builder.utility.markNotificationIfActivityCompleted = markCompletedMock;
      //@ts-ignore
      builder.utility.markIfNotificationOutdated = markOutdatedMock;

      const expectedNotification: NotificationDescriber =
        getMockNotification(1);

      //@ts-ignore
      builder.utility.getNotificationIds = jest.fn().mockReturnValue({
        id: expectedNotification.notificationId,
        shortId: expectedNotification.shortId,
      });

      const eventDay = addDays(today, 1);

      //@ts-ignore
      const notifications = builder.processEventDay(
        eventDay,
        eventEntity.event,
        eventEntity.entity,
      );

      const scheduledAt = new Date(eventDay);
      scheduledAt.setHours(FixedHourAt);
      scheduledAt.setMinutes(FixedMinuteAt);
      expectedNotification.scheduledAt = scheduledAt.getTime();
      expectedNotification.scheduledAtString = scheduledAt.toString();
      expectedNotification.fallType = 'current-day';
      expectedNotification.isSpreadInEventSet = false;
      expectedNotification.eventDayString = eventDay.toString();
      expectedNotification.randomDayCrossType = undefined;
      expectedNotification.notificationHeader = eventEntity.entity.name;
      //@ts-ignore
      expectedNotification.notificationBody = undefined;

      expect(notifications).toEqual([expectedNotification]);
      expect(markCompletedMock).toBeCalledTimes(1);
      expect(markOutdatedMock).toBeCalledTimes(1);
    });

    it('Should return notification scheduled for the next day from the event day when cross day is set', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.NotDefined, today);

      const eventNotification = event.notificationSettings.notifications[0];

      event.availability.timeFrom = { hours: 12, minutes: 10 };
      event.availability.timeTo = { hours: 10, minutes: 35 };
      eventNotification.at = { hours: 9, minutes: 55 };

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const markCompletedMock = jest.fn();
      const markOutdatedMock = jest.fn();
      //@ts-ignore
      builder.utility.markNotificationIfActivityCompleted = markCompletedMock;
      //@ts-ignore
      builder.utility.markIfNotificationOutdated = markOutdatedMock;

      const expectedNotification: NotificationDescriber =
        getMockNotification(1);

      //@ts-ignore
      builder.utility.getNotificationIds = jest.fn().mockReturnValue({
        id: expectedNotification.notificationId,
        shortId: expectedNotification.shortId,
      });

      const eventDay = addDays(today, 1);

      //@ts-ignore
      const notifications = builder.processEventDay(
        eventDay,
        eventEntity.event,
        eventEntity.entity,
      );

      const scheduledAt = addDays(new Date(eventDay), 1);
      scheduledAt.setHours(9);
      scheduledAt.setMinutes(55);
      expectedNotification.scheduledAt = scheduledAt.getTime();
      expectedNotification.scheduledAtString = scheduledAt.toString();
      expectedNotification.fallType = 'next-day';
      expectedNotification.isSpreadInEventSet = true;
      expectedNotification.eventDayString = eventDay.toString();
      expectedNotification.randomDayCrossType = undefined;
      expectedNotification.notificationHeader = eventEntity.entity.name;
      //@ts-ignore
      expectedNotification.notificationBody = undefined;

      expect(notifications).toEqual([expectedNotification]);
      expect(markCompletedMock).toBeCalledTimes(1);
      expect(markOutdatedMock).toBeCalledTimes(1);
    });
  });

  describe('Test Random notifications', () => {
    it('Should return notification scheduled for the event day when cross day is not set', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(
        event,
        PeriodicityType.NotDefined,
        today,
        false,
        false,
      );
      event.availability.timeFrom = { hours: 16, minutes: 0 };
      event.availability.timeTo = { hours: 23, minutes: 45 };

      const eventNotification = event.notificationSettings.notifications[0];
      eventNotification.triggerType = NotificationTriggerType.RANDOM;
      eventNotification.from = { hours: 16, minutes: 15 };
      eventNotification.to = { hours: 23, minutes: 35 };

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const markCompletedMock = jest.fn();
      const markOutdatedMock = jest.fn();
      const getRandomIntMock = jest.fn();
      //@ts-ignore
      builder.utility.markNotificationIfActivityCompleted = markCompletedMock;
      //@ts-ignore
      builder.utility.markIfNotificationOutdated = markOutdatedMock;
      //@ts-ignore
      builder.utility.getRandomInt = getRandomIntMock.mockReturnValue(
        MS_IN_MINUTE * 120,
      );

      const expectedNotification: NotificationDescriber =
        getMockNotification(1);

      //@ts-ignore
      builder.utility.getNotificationIds = jest.fn().mockReturnValue({
        id: expectedNotification.notificationId,
        shortId: expectedNotification.shortId,
      });

      const eventDay = addDays(today, 1);

      //@ts-ignore
      const notifications = builder.processEventDay(
        eventDay,
        eventEntity.event,
        eventEntity.entity,
      );

      const scheduledAt = new Date(eventDay);
      scheduledAt.setHours(18);
      scheduledAt.setMinutes(15);
      expectedNotification.scheduledAt = scheduledAt.getTime();
      expectedNotification.scheduledAtString = scheduledAt.toString();
      expectedNotification.fallType = 'current-day';
      expectedNotification.isSpreadInEventSet = false;
      expectedNotification.eventDayString = eventDay.toString();
      expectedNotification.randomDayCrossType = 'both-in-current-day';
      expectedNotification.notificationHeader = eventEntity.entity.name;
      //@ts-ignore
      expectedNotification.notificationBody = undefined;

      expect(notifications).toEqual([expectedNotification]);
      expect(markCompletedMock).toBeCalledTimes(1);
      expect(markOutdatedMock).toBeCalledTimes(1);
      expect(getRandomIntMock).toBeCalledTimes(1);
    });

    it('Should return notification scheduled for the event day when cross day is set and schedule-time triggers in the current day', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(
        event,
        PeriodicityType.NotDefined,
        today,
        false,
        false,
      );

      event.availability.timeFrom = { hours: 16, minutes: 0 };
      event.availability.timeTo = { hours: 10, minutes: 45 };

      const eventNotification = event.notificationSettings.notifications[0];
      eventNotification.triggerType = NotificationTriggerType.RANDOM;
      eventNotification.from = { hours: 16, minutes: 15 };
      eventNotification.to = { hours: 10, minutes: 30 };

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const markCompletedMock = jest.fn();
      const markOutdatedMock = jest.fn();
      const getRandomIntMock = jest.fn();
      //@ts-ignore
      builder.utility.markNotificationIfActivityCompleted = markCompletedMock;
      //@ts-ignore
      builder.utility.markIfNotificationOutdated = markOutdatedMock;
      //@ts-ignore
      builder.utility.getRandomInt = getRandomIntMock.mockReturnValue(
        MS_IN_MINUTE * 240,
      );

      const expectedNotification: NotificationDescriber =
        getMockNotification(1);

      //@ts-ignore
      builder.utility.getNotificationIds = jest.fn().mockReturnValue({
        id: expectedNotification.notificationId,
        shortId: expectedNotification.shortId,
      });

      const eventDay = addDays(today, 1);

      //@ts-ignore
      const notifications = builder.processEventDay(
        eventDay,
        eventEntity.event,
        eventEntity.entity,
      );

      const scheduledAt = new Date(eventDay);
      scheduledAt.setHours(20);
      scheduledAt.setMinutes(15);
      expectedNotification.scheduledAt = scheduledAt.getTime();
      expectedNotification.scheduledAtString = scheduledAt.toString();
      expectedNotification.fallType = 'current-day';
      expectedNotification.isSpreadInEventSet = true;
      expectedNotification.eventDayString = eventDay.toString();
      expectedNotification.randomDayCrossType = 'from-current-to-next';
      expectedNotification.notificationHeader = eventEntity.entity.name;
      //@ts-ignore
      expectedNotification.notificationBody = undefined;

      expect(notifications).toEqual([expectedNotification]);
      expect(markCompletedMock).toBeCalledTimes(1);
      expect(markOutdatedMock).toBeCalledTimes(1);
      expect(getRandomIntMock).toBeCalledTimes(1);
    });

    it('Should return notification scheduled for the next from the event day when cross day is set and schedule-time triggers in the next day', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(
        event,
        PeriodicityType.NotDefined,
        today,
        false,
        false,
      );

      event.availability.timeFrom = { hours: 16, minutes: 0 };
      event.availability.timeTo = { hours: 10, minutes: 45 };

      const eventNotification = event.notificationSettings.notifications[0];
      eventNotification.triggerType = NotificationTriggerType.RANDOM;
      eventNotification.from = { hours: 16, minutes: 15 };
      eventNotification.to = { hours: 10, minutes: 30 };

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const markCompletedMock = jest.fn();
      const markOutdatedMock = jest.fn();
      const getRandomIntMock = jest.fn();
      //@ts-ignore
      builder.utility.markNotificationIfActivityCompleted = markCompletedMock;
      //@ts-ignore
      builder.utility.markIfNotificationOutdated = markOutdatedMock;
      //@ts-ignore
      builder.utility.getRandomInt = getRandomIntMock.mockReturnValue(
        MS_IN_MINUTE * MINUTES_IN_HOUR * 12 + MS_IN_MINUTE * 10, //12h 10m
      );

      const expectedNotification: NotificationDescriber =
        getMockNotification(1);

      //@ts-ignore
      builder.utility.getNotificationIds = jest.fn().mockReturnValue({
        id: expectedNotification.notificationId,
        shortId: expectedNotification.shortId,
      });

      const eventDay = addDays(today, 1);

      //@ts-ignore
      const notifications = builder.processEventDay(
        eventDay,
        eventEntity.event,
        eventEntity.entity,
      );

      const scheduledAt = addDays(new Date(eventDay), 1);
      scheduledAt.setHours(4);
      scheduledAt.setMinutes(25);
      expectedNotification.scheduledAt = scheduledAt.getTime();
      expectedNotification.scheduledAtString = scheduledAt.toString();
      expectedNotification.fallType = 'next-day';
      expectedNotification.isSpreadInEventSet = true;
      expectedNotification.eventDayString = eventDay.toString();
      expectedNotification.randomDayCrossType = 'from-current-to-next';
      expectedNotification.notificationHeader = eventEntity.entity.name;
      //@ts-ignore
      expectedNotification.notificationBody = undefined;

      expect(notifications).toEqual([expectedNotification]);
      expect(markCompletedMock).toBeCalledTimes(1);
      expect(markOutdatedMock).toBeCalledTimes(1);
      expect(getRandomIntMock).toBeCalledTimes(1);
    });
  });
});

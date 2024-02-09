import { addDays, addMonths, addWeeks, subDays, subHours, subMinutes, subMonths, subWeeks } from 'date-fns';

import { AvailabilityType, NotificationTriggerType, PeriodicityType } from '@app/abstract/lib';
import { ScheduledDateCalculator } from '@app/entities/event/model';
import {
  EventNotificationDescribers,
  InactiveReason,
  NotificationDescriber,
  NotificationType,
  ScheduleEvent,
} from '@app/entities/notification/lib';

import { addTime, createBuilder, getEmptyEvent, getEventEntity, getMockNotificationPattern } from './testHelpers';
import { INotificationBuilder } from '../NotificationBuilder';

const mockUtilityProps = (builder: INotificationBuilder, now: Date) => {
  //@ts-ignore
  builder.utility.now = new Date(now);

  //@ts-ignore
  builder.utility.getNotificationIds = jest.fn().mockReturnValue({
    id: undefined,
    shortId: undefined,
  });

  //@ts-ignore
  builder.reminderCreator.utility.getNotificationIds = jest.fn().mockReturnValue({
    id: undefined,
    shortId: undefined,
  });

  //@ts-ignore
  builder.reminderCreator.utility.now = new Date(now);

  //@ts-ignore
  builder.notificationDaysExtractor.utility.now = new Date(now);
};

const calculateScheduledAt = (event: ScheduleEvent, now: Date) => {
  //@ts-ignore
  ScheduledDateCalculator.getNow = jest.fn().mockReturnValue(new Date(now));
  return ScheduledDateCalculator.calculate(event, false);
};

const FixedHourAt = 16;
const FixedMinuteAt = 45;

const ReminderHourAt = 18;
const ReminderMinuteAt = 25;

const CrossDayReminderHourAt = 7;
const CrossDayReminderMinuteAt = 5;

const setNormalSettingsToEvent = (
  event: ScheduleEvent,
  periodicityType: PeriodicityType,
  today: Date,
  setReminder = false,
  fixed = true,
) => {
  event.availability.timeFrom =
    periodicityType === PeriodicityType.Always ? { hours: 0, minutes: 0 } : { hours: 15, minutes: 30 };
  event.availability.timeTo =
    periodicityType === PeriodicityType.Always ? { hours: 23, minutes: 59 } : { hours: 20, minutes: 15 };
  event.availability.availabilityType =
    periodicityType === PeriodicityType.Always ? AvailabilityType.AlwaysAvailable : AvailabilityType.ScheduledAccess;
  event.availability.periodicityType = periodicityType;
  event.availability.startDate = subMonths(today, 1);
  event.availability.endDate = addMonths(today, 1);
  event.notificationSettings.notifications.push({
    at: fixed ? { hours: FixedHourAt, minutes: FixedMinuteAt } : null,
    triggerType: fixed ? NotificationTriggerType.FIXED : NotificationTriggerType.RANDOM,
    from: null,
    to: null,
  });
  if (setReminder) {
    event.notificationSettings.reminder = {
      activityIncomplete: 1,
      reminderTime: { hours: ReminderHourAt, minutes: ReminderMinuteAt },
    };
  }
};

const addReminder = (
  result: NotificationDescriber[],
  isCrossDay: boolean,
  eventDate: Date,
  activityIncompleteDays: number,
  inactiveReason?: 'invalid-period' | 'outdated',
) => {
  const mockNotificationPattern = getMockNotificationPattern();

  const reminderTriggerAt = addDays(new Date(eventDate), activityIncompleteDays);
  if (!isCrossDay) {
    reminderTriggerAt.setHours(ReminderHourAt);
    reminderTriggerAt.setMinutes(ReminderMinuteAt);
  } else {
    reminderTriggerAt.setHours(CrossDayReminderHourAt);
    reminderTriggerAt.setMinutes(CrossDayReminderMinuteAt);
  }

  let itemToAdd: NotificationDescriber = {
    ...mockNotificationPattern,
    scheduledAt: reminderTriggerAt.getTime(),
    scheduledAtString: reminderTriggerAt.toString(),
    eventDayString: eventDate.toString(),
    fallType: activityIncompleteDays === 0 ? 'current-day' : activityIncompleteDays === 1 ? 'next-day' : 'in-future',
    type: NotificationType.Reminder,
    isSpreadInEventSet: isCrossDay,
    notificationBody: 'Just a kindly reminder to complete the activity',
  };

  if (inactiveReason) {
    itemToAdd = {
      ...itemToAdd,
      isActive: false,
      inactiveReason:
        inactiveReason === 'invalid-period'
          ? InactiveReason.FallOnInvalidPeriod
          : inactiveReason === 'outdated'
            ? InactiveReason.Outdated
            : InactiveReason.NotDefined,
    };
  }

  result.push(itemToAdd);
};

const addNotification = (
  result: NotificationDescriber[],
  eventDate: Date,
  inactiveReason?: 'outdated' | 'completed',
) => {
  const mockNotificationPattern = getMockNotificationPattern();

  const triggerAt = new Date(eventDate);
  triggerAt.setHours(FixedHourAt);
  triggerAt.setMinutes(FixedMinuteAt);

  let itemToAdd: NotificationDescriber = {
    ...mockNotificationPattern,
    scheduledAt: triggerAt.getTime(),
    scheduledAtString: triggerAt.toString(),
    eventDayString: eventDate.toString(),
    fallType: 'current-day',
    type: NotificationType.Regular,
    randomDayCrossType: undefined,
  };

  if (inactiveReason) {
    itemToAdd = {
      ...itemToAdd,
      isActive: false,
      inactiveReason:
        inactiveReason === 'outdated'
          ? InactiveReason.Outdated
          : inactiveReason === 'completed'
            ? InactiveReason.ActivityCompleted
            : InactiveReason.NotDefined,
    };
  }

  result.push(itemToAdd);
};

const CrossDayFixedHourAt = 5;
const CrossDayFixedMinuteAt = 10;

const addCrossDayNotification = (
  result: NotificationDescriber[],
  eventDate: Date,
  inactiveReason?: 'outdated' | 'completed',
) => {
  const mockNotificationPattern = getMockNotificationPattern();

  const triggerAt = addDays(new Date(eventDate), 1);
  triggerAt.setHours(CrossDayFixedHourAt);
  triggerAt.setMinutes(CrossDayFixedMinuteAt);

  let itemToAdd: NotificationDescriber = {
    ...mockNotificationPattern,
    scheduledAt: triggerAt.getTime(),
    scheduledAtString: triggerAt.toString(),
    eventDayString: eventDate.toString(),
    fallType: 'next-day',
    type: NotificationType.Regular,
    isSpreadInEventSet: true,
    randomDayCrossType: undefined,
  };

  if (inactiveReason) {
    itemToAdd = {
      ...itemToAdd,
      isActive: false,
      inactiveReason:
        inactiveReason === 'outdated'
          ? InactiveReason.Outdated
          : inactiveReason === 'completed'
            ? InactiveReason.ActivityCompleted
            : InactiveReason.NotDefined,
    };
  }

  result.push(itemToAdd);
};

describe('NotificationBuilder: weekly event penetrating tests', () => {
  describe('Test non cross-day', () => {
    it('Should return array with 2 notifications when reminder is unset and selectedDate is today', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Weekly, today);

      event.selectedDate = new Date(today);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, new Date(today));
      addNotification(expected, addDays(today, 7));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Weekly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(2);
    });

    it('Should return array with 3 notifications when reminder is unset and selectedDate is today - 2 days', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Weekly, today);

      event.selectedDate = subDays(new Date(today), 2);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, new Date(event.selectedDate), 'outdated');
      addNotification(expected, addWeeks(event.selectedDate, 1));
      addNotification(expected, addWeeks(event.selectedDate, 2));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Weekly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(3);
    });

    it('Should return array with 2 notifications when reminder is unset and selectedDate is today - 7 days', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Weekly, today);

      event.selectedDate = subDays(new Date(today), 7);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, addWeeks(event.selectedDate, 1));
      addNotification(expected, addWeeks(event.selectedDate, 2));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Weekly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(2);
    });

    it('Should return array with 3 notifications when reminder is unset and selectedDate is today - 10 days', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Weekly, today);

      event.selectedDate = subDays(new Date(today), 10);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, addWeeks(event.selectedDate, 1), 'outdated');
      addNotification(expected, addWeeks(event.selectedDate, 2));
      addNotification(expected, addWeeks(event.selectedDate, 3));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Weekly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(3);
    });

    it('Should return array with 3 notifications when reminder is unset and selectedDate is today + 2 days', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Weekly, today);

      event.selectedDate = addDays(new Date(today), 2);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, subWeeks(event.selectedDate, 1), 'outdated');
      addNotification(expected, new Date(event.selectedDate));
      addNotification(expected, addWeeks(event.selectedDate, 1));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Weekly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(3);
    });

    it('Should return array with 8 notifications when reminder is set and selectedDate is today', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Weekly, today, true);

      event.notificationSettings.reminder!.activityIncomplete = 7;

      event.selectedDate = new Date(today);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      const from = subWeeks(today, 4);

      addReminder(expected, false, from, 7, 'invalid-period');
      addReminder(expected, false, addWeeks(from, 1), 7, 'invalid-period');
      addReminder(expected, false, addWeeks(from, 2), 7, 'invalid-period');
      addReminder(expected, false, addWeeks(from, 3), 7);
      addNotification(expected, new Date(today));
      addReminder(expected, false, new Date(today), 7);
      addNotification(expected, addWeeks(today, 1));
      addReminder(expected, false, addWeeks(today, 1), 7, 'invalid-period');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Weekly}, 1 notifications, reminder set`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(8);
    });
  });

  describe('Test cross-day', () => {
    it('Should return array with 3 notifications when reminder is unset and selectedDate is yesterday', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Weekly, today, false);

      event.availability.timeFrom = { hours: 20, minutes: 0 };
      event.availability.timeTo = { hours: 8, minutes: 15 };
      event.notificationSettings.notifications[0].at = {
        hours: 5,
        minutes: 10,
      };

      event.selectedDate = subDays(today, 1);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addCrossDayNotification(expected, new Date(event.selectedDate), 'outdated');
      addCrossDayNotification(expected, addWeeks(event.selectedDate, 1));
      addCrossDayNotification(expected, addWeeks(event.selectedDate, 2));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Weekly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(3);
    });

    it('Should return array with 10 notifications when reminder is set and selectedDate is yesterday', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Weekly, today, true);

      event.availability.timeFrom = { hours: 20, minutes: 0 };
      event.availability.timeTo = { hours: 8, minutes: 15 };
      event.notificationSettings.notifications[0].at = {
        hours: 5,
        minutes: 10,
      };
      event.notificationSettings.reminder!.activityIncomplete = 1;
      event.notificationSettings.reminder!.reminderTime = {
        hours: 7,
        minutes: 5,
      };

      event.selectedDate = subDays(today, 1);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      let from = subWeeks(event.selectedDate, 4);

      addReminder(expected, true, from, 1, 'invalid-period');
      addReminder(expected, true, addWeeks(from, 1), 1, 'invalid-period');
      addReminder(expected, true, addWeeks(from, 2), 1, 'invalid-period');
      addReminder(expected, true, addWeeks(from, 3), 1, 'invalid-period');

      from = new Date(event.selectedDate);

      addCrossDayNotification(expected, from, 'outdated');
      addReminder(expected, true, from, 1, 'outdated');

      addCrossDayNotification(expected, addWeeks(from, 1));
      addReminder(expected, true, addWeeks(from, 1), 1);

      addCrossDayNotification(expected, addWeeks(from, 2));
      addReminder(expected, true, addWeeks(from, 2), 1);

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Weekly}, 1 notifications, reminder set`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(10);
    });
  });

  describe('Test when there is progress with completed entity', () => {
    it('Should return array with 2 notifications when reminder is unset and selectedDate is today and regular event', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 16, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Weekly, today);

      event.selectedDate = new Date(today);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity, subMinutes(new Date(now), 20));
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, new Date(today), 'completed');
      addNotification(expected, addDays(today, 7));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Weekly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(2);
    });

    it('Should return array with 2 notifications when reminder is unset and selectedDate is yesterday and cross day event', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 5, minutes: 0 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Weekly, today, false);

      event.availability.timeFrom = { hours: 20, minutes: 0 };
      event.availability.timeTo = { hours: 8, minutes: 15 };
      event.notificationSettings.notifications[0].at = {
        hours: 5,
        minutes: 10,
      };

      event.selectedDate = subDays(today, 1);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity, subHours(now, 1));
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addCrossDayNotification(expected, new Date(event.selectedDate), 'completed');
      addCrossDayNotification(expected, addWeeks(event.selectedDate, 1));
      addCrossDayNotification(expected, addWeeks(event.selectedDate, 2));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Weekly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(3);
    });
  });
});

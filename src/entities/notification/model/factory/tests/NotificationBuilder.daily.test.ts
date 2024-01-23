import { addDays, addMonths, subDays, subMonths } from 'date-fns';

import {
  AvailabilityType,
  NotificationTriggerType,
  PeriodicityType,
} from '@app/abstract/lib';
import { ScheduledDateCalculator } from '@app/entities/event/model';
import {
  EventNotificationDescribers,
  InactiveReason,
  NotificationDescriber,
  NotificationType,
  ScheduleEvent,
} from '@app/entities/notification/lib';

import {
  createBuilder,
  getEmptyEvent,
  getEventEntity,
  getMockNotificationPattern,
} from './testHelpers';
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
  builder.utility.getNotificationIds = jest.fn().mockReturnValue({
    id: undefined,
    shortId: undefined,
  });

  //@ts-ignore
  builder.reminderCreator.utility.getNotificationIds = jest
    .fn()
    .mockReturnValue({
      id: undefined,
      shortId: undefined,
    });
  //@ts-ignore
  builder.reminderCreator.utility.now = date;

  //@ts-ignore
  builder.reminderCreator.utility.now = date;
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

const CrossDayFixedHourAt = 9;
const CrossDayFixedMinuteAt = 25;

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
      reminderTime: { hours: ReminderHourAt, minutes: ReminderMinuteAt },
    };
  }
};

const setCrossDaySettingsToEvent = (
  event: ScheduleEvent,
  periodicityType: PeriodicityType,
  today: Date,
  setReminder = false,
  fixed = true,
) => {
  setNormalSettingsToEvent(event, periodicityType, today, setReminder, fixed);

  event.availability.timeFrom = { hours: 18, minutes: 0 };
  event.availability.timeTo = { hours: 10, minutes: 35 };
  event.notificationSettings.notifications[0].at = {
    hours: CrossDayFixedHourAt,
    minutes: CrossDayFixedMinuteAt,
  };
};

const addReminder = (
  result: NotificationDescriber[],
  isCrossDay: boolean,
  eventDate: Date,
  activityIncompleteDays: number,
  inactiveReason?: 'invalid-period' | 'outdated',
) => {
  const mockNotificationPattern = getMockNotificationPattern();

  const reminderTriggerAt = addDays(
    new Date(eventDate),
    activityIncompleteDays,
  );
  reminderTriggerAt.setHours(ReminderHourAt);
  reminderTriggerAt.setMinutes(ReminderMinuteAt);

  let itemToAdd: NotificationDescriber = {
    ...mockNotificationPattern,
    scheduledAt: reminderTriggerAt.getTime(),
    scheduledAtString: reminderTriggerAt.toString(),
    eventDayString: eventDate.toString(),
    fallType:
      activityIncompleteDays === 0
        ? 'current-day'
        : activityIncompleteDays === 1
        ? 'next-day'
        : 'in-future',
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
  inactiveReason?: 'outdated',
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
          : InactiveReason.NotDefined,
    };
  }

  result.push(itemToAdd);
};

const addCrossDayNotification = (
  result: NotificationDescriber[],
  eventDate: Date,
  inactiveReason?: 'outdated',
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
          : InactiveReason.NotDefined,
    };
  }

  result.push(itemToAdd);
};

describe('NotificationBuilder: daily event penetrating tests', () => {
  describe('Test non cross-day', () => {
    it('Should return array of 9 notifications when reminder is unset and event-endDate is today + 7 days', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Daily, today);

      event.availability.endDate = addDays(today, 7);

      event.scheduledAt = calculateScheduledAt(event, today);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, subDays(today, 1), 'outdated');
      addNotification(expected, new Date(today));
      addNotification(expected, addDays(today, 1));
      addNotification(expected, addDays(today, 2));
      addNotification(expected, addDays(today, 3));
      addNotification(expected, addDays(today, 4));
      addNotification(expected, addDays(today, 5));
      addNotification(expected, addDays(today, 6));
      addNotification(expected, addDays(today, 7));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Daily}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(9);
    });

    it('Should return array of 9 notifications when reminder is unset and event-startDate is today + 5 days', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Daily, today);

      event.availability.startDate = addDays(today, 5);

      event.scheduledAt = calculateScheduledAt(event, today);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, addDays(today, 5));
      addNotification(expected, addDays(today, 6));
      addNotification(expected, addDays(today, 7));
      addNotification(expected, addDays(today, 8));
      addNotification(expected, addDays(today, 9));
      addNotification(expected, addDays(today, 10));
      addNotification(expected, addDays(today, 11));
      addNotification(expected, addDays(today, 12));
      addNotification(expected, addDays(today, 13));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Daily}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(9);
    });

    it('Should return array of 24 notifications including reminders when reminder is set and activityIncomplete is 1 and event-endDate is today + 7 days', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Daily, today, true);

      event.availability.endDate = addDays(today, 7);

      event.scheduledAt = calculateScheduledAt(event, today);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addReminder(expected, false, subDays(today, 7), 1, 'invalid-period');
      addReminder(expected, false, subDays(today, 6), 1, 'invalid-period');
      addReminder(expected, false, subDays(today, 5), 1, 'invalid-period');
      addReminder(expected, false, subDays(today, 4), 1, 'invalid-period');
      addReminder(expected, false, subDays(today, 3), 1, 'invalid-period');
      addReminder(expected, false, subDays(today, 2), 1, 'outdated');

      addNotification(expected, subDays(today, 1), 'outdated');
      addReminder(expected, false, subDays(today, 1), 1);
      addNotification(expected, new Date(today));
      addReminder(expected, false, new Date(today), 1);
      addNotification(expected, addDays(today, 1));
      addReminder(expected, false, addDays(today, 1), 1);
      addNotification(expected, addDays(today, 2));
      addReminder(expected, false, addDays(today, 2), 1);
      addNotification(expected, addDays(today, 3));
      addReminder(expected, false, addDays(today, 3), 1);
      addNotification(expected, addDays(today, 4));
      addReminder(expected, false, addDays(today, 4), 1);
      addNotification(expected, addDays(today, 5));
      addReminder(expected, false, addDays(today, 5), 1);
      addNotification(expected, addDays(today, 6));
      addReminder(expected, false, addDays(today, 6), 1);
      addNotification(expected, addDays(today, 7));
      addReminder(expected, false, addDays(today, 7), 1, 'invalid-period');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: 'For mock-entity-name, DAILY, 1 notifications, reminder set',
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(24);
    });

    it('Should return array of 18 notifications including reminders when reminder is set and activityIncomplete is 1 and event-startDate is today + 5 days', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Daily, today, true);

      event.availability.startDate = addDays(today, 5);

      event.scheduledAt = calculateScheduledAt(event, today);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, addDays(today, 5));
      addReminder(expected, false, addDays(today, 5), 1);
      addNotification(expected, addDays(today, 6));
      addReminder(expected, false, addDays(today, 6), 1);
      addNotification(expected, addDays(today, 7));
      addReminder(expected, false, addDays(today, 7), 1);
      addNotification(expected, addDays(today, 8));
      addReminder(expected, false, addDays(today, 8), 1);
      addNotification(expected, addDays(today, 9));
      addReminder(expected, false, addDays(today, 9), 1);
      addNotification(expected, addDays(today, 10));
      addReminder(expected, false, addDays(today, 10), 1);
      addNotification(expected, addDays(today, 11));
      addReminder(expected, false, addDays(today, 11), 1);
      addNotification(expected, addDays(today, 12));
      addReminder(expected, false, addDays(today, 12), 1);
      addNotification(expected, addDays(today, 13));
      addReminder(expected, false, addDays(today, 13), 1, 'invalid-period');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: 'For mock-entity-name, DAILY, 1 notifications, reminder set',
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(18);
    });
  });

  describe('Test cross-day, regular notifications time should be set to the next day from the event day', () => {
    it('Should return array of 9 notifications when reminder is unset and event-endDate is today + 7 days', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setCrossDaySettingsToEvent(event, PeriodicityType.Daily, today);

      event.availability.endDate = addDays(today, 7);

      event.scheduledAt = calculateScheduledAt(event, today);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addCrossDayNotification(expected, subDays(today, 1), 'outdated');
      addCrossDayNotification(expected, new Date(today));
      addCrossDayNotification(expected, addDays(today, 1));
      addCrossDayNotification(expected, addDays(today, 2));
      addCrossDayNotification(expected, addDays(today, 3));
      addCrossDayNotification(expected, addDays(today, 4));
      addCrossDayNotification(expected, addDays(today, 5));
      addCrossDayNotification(expected, addDays(today, 6));
      addCrossDayNotification(expected, addDays(today, 7));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Daily}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(9);
    });

    it('Should return array of 9 notifications when reminder is unset and event-startDate is today + 5 days', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setCrossDaySettingsToEvent(event, PeriodicityType.Daily, today);

      event.availability.startDate = addDays(today, 5);

      event.scheduledAt = calculateScheduledAt(event, today);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addCrossDayNotification(expected, addDays(today, 5));
      addCrossDayNotification(expected, addDays(today, 6));
      addCrossDayNotification(expected, addDays(today, 7));
      addCrossDayNotification(expected, addDays(today, 8));
      addCrossDayNotification(expected, addDays(today, 9));
      addCrossDayNotification(expected, addDays(today, 10));
      addCrossDayNotification(expected, addDays(today, 11));
      addCrossDayNotification(expected, addDays(today, 12));
      addCrossDayNotification(expected, addDays(today, 13));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Daily}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(9);
    });

    it('Should return array of 24 notifications including reminders when reminder is set and activityIncomplete is 1 and event-endDate is today + 7 days', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setCrossDaySettingsToEvent(event, PeriodicityType.Daily, today, true);

      event.availability.endDate = addDays(today, 7);

      event.scheduledAt = calculateScheduledAt(event, today);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addReminder(expected, true, subDays(today, 7), 1, 'invalid-period');
      addReminder(expected, true, subDays(today, 6), 1, 'invalid-period');
      addReminder(expected, true, subDays(today, 5), 1, 'invalid-period');
      addReminder(expected, true, subDays(today, 4), 1, 'invalid-period');
      addReminder(expected, true, subDays(today, 3), 1, 'invalid-period');
      addReminder(expected, true, subDays(today, 2), 1, 'outdated');

      addCrossDayNotification(expected, subDays(today, 1), 'outdated');
      addReminder(expected, true, subDays(today, 1), 1);
      addCrossDayNotification(expected, new Date(today));
      addReminder(expected, true, new Date(today), 1);
      addCrossDayNotification(expected, addDays(today, 1));
      addReminder(expected, true, addDays(today, 1), 1);
      addCrossDayNotification(expected, addDays(today, 2));
      addReminder(expected, true, addDays(today, 2), 1);
      addCrossDayNotification(expected, addDays(today, 3));
      addReminder(expected, true, addDays(today, 3), 1);
      addCrossDayNotification(expected, addDays(today, 4));
      addReminder(expected, true, addDays(today, 4), 1);
      addCrossDayNotification(expected, addDays(today, 5));
      addReminder(expected, true, addDays(today, 5), 1);
      addCrossDayNotification(expected, addDays(today, 6));
      addReminder(expected, true, addDays(today, 6), 1);
      addCrossDayNotification(expected, addDays(today, 7));
      addReminder(expected, true, addDays(today, 7), 1, 'invalid-period');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: 'For mock-entity-name, DAILY, 1 notifications, reminder set',
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(24);
    });

    it('Should return array of 18 notifications including reminders when reminder is set and activityIncomplete is 1 and event-startDate is today + 5 days', () => {
      const today = new Date(2024, 0, 3);

      const event = getEmptyEvent();
      setCrossDaySettingsToEvent(event, PeriodicityType.Daily, today, true);

      event.availability.startDate = addDays(today, 5);

      event.scheduledAt = calculateScheduledAt(event, today);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addCrossDayNotification(expected, addDays(today, 5));
      addReminder(expected, true, addDays(today, 5), 1);
      addCrossDayNotification(expected, addDays(today, 6));
      addReminder(expected, true, addDays(today, 6), 1);
      addCrossDayNotification(expected, addDays(today, 7));
      addReminder(expected, true, addDays(today, 7), 1);
      addCrossDayNotification(expected, addDays(today, 8));
      addReminder(expected, true, addDays(today, 8), 1);
      addCrossDayNotification(expected, addDays(today, 9));
      addReminder(expected, true, addDays(today, 9), 1);
      addCrossDayNotification(expected, addDays(today, 10));
      addReminder(expected, true, addDays(today, 10), 1);
      addCrossDayNotification(expected, addDays(today, 11));
      addReminder(expected, true, addDays(today, 11), 1);
      addCrossDayNotification(expected, addDays(today, 12));
      addReminder(expected, true, addDays(today, 12), 1);
      addCrossDayNotification(expected, addDays(today, 13));
      addReminder(expected, true, addDays(today, 13), 1, 'invalid-period');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: 'For mock-entity-name, DAILY, 1 notifications, reminder set',
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(18);
    });
  });
});

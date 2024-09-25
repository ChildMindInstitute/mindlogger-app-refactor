import { addDays, addMonths, subDays, subMonths } from 'date-fns';

import {
  AvailabilityType,
  NotificationTriggerType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { getDefaultScheduledDateCalculator } from '@app/entities/event/model/operations/scheduledDateCalculatorInstance';
import {
  EventNotificationDescribers,
  InactiveReason,
  NotificationDescriber,
  NotificationType,
  ScheduleEvent,
} from '@app/entities/notification/lib/types/notificationBuilder';
import { HourMinute } from '@app/shared/lib/types/dateTime';

import {
  addTime,
  createBuilder,
  getEmptyEvent,
  getEventEntity,
  getMockNotificationPattern,
} from './testHelpers';
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
  builder.reminderCreator.utility.getNotificationIds = jest
    .fn()
    .mockReturnValue({
      id: undefined,
      shortId: undefined,
    });

  //@ts-ignore
  builder.reminderCreator.utility.now = new Date(now);

  //@ts-ignore
  builder.notificationDaysExtractor.utility.now = new Date(now);
};

const calculateScheduledAt = (event: ScheduleEvent, now: Date) => {
  const calculator = getDefaultScheduledDateCalculator();
  //@ts-ignore
  calculator.getNow = jest.fn().mockReturnValue(new Date(now));
  return calculator.calculate(event, false);
};

const FixedHourAt = 16;
const FixedMinuteAt = 45;

const ReminderHourAt = 18;
const ReminderMinuteAt = 25;

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
  event.availability.startDate = subMonths(today, 3);
  event.availability.endDate = addMonths(today, 3);
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

const CrossDayReminderHourAt = 7;
const CrossDayReminderMinuteAt = 5;

const addReminder = (
  result: NotificationDescriber[],
  isCrossDay: boolean,
  eventDate: Date,
  activityIncompleteMonths: number,
  inactiveReason?: 'invalid-period' | 'outdated',
  specificTime?: HourMinute,
) => {
  const mockNotificationPattern = getMockNotificationPattern();

  let reminderTriggerAt = addMonths(
    new Date(eventDate),
    activityIncompleteMonths,
  );

  if (!isCrossDay && !specificTime) {
    reminderTriggerAt.setHours(ReminderHourAt);
    reminderTriggerAt.setMinutes(ReminderMinuteAt);
  }

  if (!isCrossDay && specificTime) {
    reminderTriggerAt.setHours(specificTime.hours);
    reminderTriggerAt.setMinutes(specificTime.minutes);
  }

  if (isCrossDay) {
    reminderTriggerAt = addDays(reminderTriggerAt, 1);
    reminderTriggerAt.setHours(CrossDayReminderHourAt);
    reminderTriggerAt.setMinutes(CrossDayReminderMinuteAt);
  }

  let itemToAdd: NotificationDescriber = {
    ...mockNotificationPattern,
    scheduledAt: reminderTriggerAt.getTime(),
    scheduledAtString: reminderTriggerAt.toString(),
    eventDayString: eventDate.toString(),
    fallType: activityIncompleteMonths === 0 ? 'current-day' : 'in-future',
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
  specificTime?: HourMinute,
) => {
  const mockNotificationPattern = getMockNotificationPattern();

  const triggerAt = new Date(eventDate);

  if (!specificTime) {
    triggerAt.setHours(FixedHourAt);
    triggerAt.setMinutes(FixedMinuteAt);
  } else {
    triggerAt.setHours(specificTime.hours);
    triggerAt.setMinutes(specificTime.minutes);
  }

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

describe('NotificationBuilder: monthly event penetrating tests', () => {
  describe('Test non cross-day', () => {
    it('Should return 1 notification when reminder is unset and selectedDate is today', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.selectedDate = new Date(today);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, new Date(today));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(1);
    });

    it('Should return 5 notifications when reminder is set and 2 notifications are in settings and selectedDate is today', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.notificationSettings.notifications.push({
        at: { hours: 17, minutes: 50 },
        from: null,
        to: null,
        triggerType: NotificationTriggerType.FIXED,
      });

      event.notificationSettings.reminder = {
        activityIncomplete: 1,
        reminderTime: { hours: 15, minutes: 45 },
      };

      event.selectedDate = new Date(today);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addReminder(expected, false, subMonths(today, 2), 1, 'invalid-period', {
        hours: 15,
        minutes: 45,
      });
      addReminder(expected, false, subMonths(today, 1), 1, undefined, {
        hours: 15,
        minutes: 45,
      });
      addNotification(expected, new Date(today));
      addNotification(expected, new Date(today), undefined, {
        hours: 17,
        minutes: 50,
      });
      addReminder(expected, false, today, 1, 'invalid-period', {
        hours: 15,
        minutes: 45,
      });

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 2 notifications, reminder set`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(5);
    });

    it('Should return 1 notification when reminder is unset and selectedDate is yesterday', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.selectedDate = subDays(today, 1);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, new Date(event.selectedDate), 'outdated');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(1);
    });

    it('Should return 1 notification when reminder is unset and selectedDate is 10 days ago', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.selectedDate = subDays(today, 10);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, new Date(event.selectedDate), 'outdated');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(1);
    });

    it('Should return 2 notifications when reminder is unset and selectedDate is 20 days ago', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.selectedDate = subDays(today, 20);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, new Date(event.selectedDate), 'outdated');
      addNotification(expected, addMonths(event.selectedDate, 1));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(2);
    });

    it('Should return 1 notification when reminder is unset and selectedDate is 1 month ago', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.selectedDate = subMonths(today, 1);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, addMonths(event.selectedDate, 1));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(1);
    });

    it('Should return 1 notification when reminder is unset and selectedDate is 35 days ago', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.selectedDate = subDays(today, 35);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, addMonths(event.selectedDate, 1), 'outdated');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(1);
    });

    it('Should return 2 notifications when reminder is unset and selectedDate is today + 10 days', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.selectedDate = addDays(today, 10);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, subMonths(event.selectedDate, 1), 'outdated');
      addNotification(expected, new Date(event.selectedDate));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(2);
    });

    it('Should return 1 notification when reminder is unset and selectedDate is today + 20 days', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.selectedDate = addDays(today, 20);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, subMonths(event.selectedDate, 1), 'outdated');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(1);
    });

    it('Should return 1 notification when reminder is unset and selectedDate is today + 35 days', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.selectedDate = addDays(today, 20);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addNotification(expected, subMonths(event.selectedDate, 1), 'outdated');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(1);
    });
  });

  describe('Test cross-day', () => {
    it('Should return 1 notification when reminder is unset and selectedDate is today', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.availability.timeFrom = { hours: 20, minutes: 15 };
      event.availability.timeTo = { hours: 10, minutes: 45 };

      event.notificationSettings.notifications[0].at = {
        hours: 5,
        minutes: 10,
      };

      event.selectedDate = new Date(today);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addCrossDayNotification(expected, new Date(today));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(1);
    });

    it('Should return 4 notifications when reminder is set and selectedDate is today', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 12, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.availability.timeFrom = { hours: 20, minutes: 15 };
      event.availability.timeTo = { hours: 10, minutes: 45 };

      event.notificationSettings.notifications[0].at = {
        hours: 5,
        minutes: 10,
      };

      event.notificationSettings.reminder = {
        activityIncomplete: 1,
        reminderTime: { hours: 7, minutes: 5 },
      };

      event.selectedDate = new Date(today);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addReminder(expected, true, subMonths(today, 2), 1, 'invalid-period');
      addReminder(expected, true, subMonths(today, 1), 1);
      addCrossDayNotification(expected, new Date(today));
      addReminder(expected, true, new Date(today), 1, 'invalid-period');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder set`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(4);
    });

    it('Should return 1 notification when reminder is unset and selectedDate is yesterday', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 3, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.availability.timeFrom = { hours: 20, minutes: 15 };
      event.availability.timeTo = { hours: 10, minutes: 45 };

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

      addCrossDayNotification(expected, subDays(today, 1));

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder unset`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(1);
    });

    it('Should return 4 notifications when reminder is set and selectedDate is yesterday', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 3, minutes: 30 }, today);

      const event = getEmptyEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Monthly, today);

      event.availability.timeFrom = { hours: 20, minutes: 15 };
      event.availability.timeTo = { hours: 10, minutes: 45 };

      event.notificationSettings.notifications[0].at = {
        hours: 5,
        minutes: 10,
      };

      event.notificationSettings.reminder = {
        activityIncomplete: 1,
        reminderTime: { hours: 7, minutes: 5 },
      };

      event.selectedDate = subDays(today, 1);

      event.scheduledAt = calculateScheduledAt(event, now);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, now);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addReminder(
        expected,
        true,
        subMonths(event.selectedDate, 2),
        1,
        'invalid-period',
      );
      addReminder(expected, true, subMonths(event.selectedDate, 1), 1);
      addCrossDayNotification(expected, new Date(event.selectedDate));
      addReminder(
        expected,
        true,
        new Date(event.selectedDate),
        1,
        'invalid-period',
      );

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName: `For mock-entity-name, ${PeriodicityType.Monthly}, 1 notifications, reminder set`,
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
      expect(result.events[0].notifications.length).toEqual(4);
    });
  });
});

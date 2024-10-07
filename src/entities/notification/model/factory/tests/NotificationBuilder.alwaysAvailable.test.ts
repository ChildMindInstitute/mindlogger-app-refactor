import { addDays, addMonths, subDays, subMonths } from 'date-fns';

import {
  AvailabilityType,
  NotificationTriggerType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { IScheduledDateCalculator } from '@app/entities/event/model/operations/IScheduledDateCalculator';
import { ScheduledDateCalculator } from '@app/entities/event/model/operations/ScheduledDateCalculator';
import { getDefaultScheduledDateCalculator } from '@app/entities/event/model/operations/scheduledDateCalculatorInstance';
import {
  EventNotificationDescribers,
  InactiveReason,
  NotificationDescriber,
  NotificationType,
  ScheduleEvent,
} from '@app/entities/notification/lib/types/notificationBuilder';

import {
  createBuilder,
  getEmptyEvent,
  getEventEntity,
  getMockNotificationPattern,
} from './testHelpers';
import { INotificationBuilder } from '../INotificationBuilder';

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

const addReminder = (
  result: NotificationDescriber[],
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
    type: NotificationType.Regular,
    fallType: 'current-day',
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

type TestScheduledDateCalculator = IScheduledDateCalculator & {
  getNow: ScheduledDateCalculator['getNow'];
};

describe('NotificationBuilder: always-available penetrating tests', () => {
  let calculator: TestScheduledDateCalculator;
  let calculateScheduledAt: (event: ScheduleEvent, now: Date) => Date | null;

  beforeEach(() => {
    calculator =
      getDefaultScheduledDateCalculator() as never as TestScheduledDateCalculator;

    calculateScheduledAt = (event: ScheduleEvent, now: Date) => {
      jest.spyOn(calculator, 'getNow').mockReturnValue(now as never);
      return calculator.calculate(event, false);
    };
  });

  it('Should return array of 15 notifications when reminder is unset', () => {
    const today = new Date(2024, 0, 3);

    const event = getEmptyEvent();
    setNormalSettingsToEvent(event, PeriodicityType.Always, today);

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
    addNotification(expected, addDays(today, 8));
    addNotification(expected, addDays(today, 9));
    addNotification(expected, addDays(today, 10));
    addNotification(expected, addDays(today, 11));
    addNotification(expected, addDays(today, 12));
    addNotification(expected, addDays(today, 13));

    const expectedResult: EventNotificationDescribers = {
      eventId: 'mock-event-id',
      eventName:
        'For mock-entity-name, ALWAYS, 1 notifications, reminder unset',
      notifications: expected,
      scheduleEvent: event,
    };

    expect(result.events).toEqual([expectedResult]);
    expect(result.events[0].notifications.length).toEqual(15);
  });

  it('Should return array of 15 notifications when reminder is unset and activity is completed today', () => {
    const today = new Date(2024, 0, 3);
    const now = new Date(today);
    now.setHours(16);
    now.setMinutes(10);

    const event = getEmptyEvent();
    setNormalSettingsToEvent(event, PeriodicityType.Always, today);

    event.scheduledAt = calculateScheduledAt(event, now);

    const eventEntity = getEventEntity(event);

    const completedAt = new Date(now);
    completedAt.setMinutes(5);

    const builder = createBuilder(eventEntity, completedAt);
    mockUtilityProps(builder, now);

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
    addNotification(expected, addDays(today, 8));
    addNotification(expected, addDays(today, 9));
    addNotification(expected, addDays(today, 10));
    addNotification(expected, addDays(today, 11));
    addNotification(expected, addDays(today, 12));
    addNotification(expected, addDays(today, 13));

    const expectedResult: EventNotificationDescribers = {
      eventId: 'mock-event-id',
      eventName:
        'For mock-entity-name, ALWAYS, 1 notifications, reminder unset',
      notifications: expected,
      scheduleEvent: event,
    };

    expect(result.events).toEqual([expectedResult]);
    expect(result.events[0].notifications.length).toEqual(15);
  });

  it('Should return array of 36 notifications including reminders when reminder is set and activityIncomplete is 1', () => {
    const today = new Date(2024, 0, 3);

    const event = getEmptyEvent();
    setNormalSettingsToEvent(event, PeriodicityType.Always, today, true);

    event.scheduledAt = calculateScheduledAt(event, today);

    const eventEntity = getEventEntity(event);

    const builder = createBuilder(eventEntity);
    mockUtilityProps(builder, today);

    const result = builder.build();

    const expected: NotificationDescriber[] = [];

    addReminder(expected, subDays(today, 7), 1, 'invalid-period');
    addReminder(expected, subDays(today, 6), 1, 'invalid-period');
    addReminder(expected, subDays(today, 5), 1, 'invalid-period');
    addReminder(expected, subDays(today, 4), 1, 'invalid-period');
    addReminder(expected, subDays(today, 3), 1, 'invalid-period');
    addReminder(expected, subDays(today, 2), 1, 'outdated');

    addNotification(expected, subDays(today, 1), 'outdated');
    addReminder(expected, subDays(today, 1), 1);
    addNotification(expected, new Date(today));
    addReminder(expected, new Date(today), 1);
    addNotification(expected, addDays(today, 1));
    addReminder(expected, addDays(today, 1), 1);
    addNotification(expected, addDays(today, 2));
    addReminder(expected, addDays(today, 2), 1);
    addNotification(expected, addDays(today, 3));
    addReminder(expected, addDays(today, 3), 1);
    addNotification(expected, addDays(today, 4));
    addReminder(expected, addDays(today, 4), 1);
    addNotification(expected, addDays(today, 5));
    addReminder(expected, addDays(today, 5), 1);
    addNotification(expected, addDays(today, 6));
    addReminder(expected, addDays(today, 6), 1);
    addNotification(expected, addDays(today, 7));
    addReminder(expected, addDays(today, 7), 1);
    addNotification(expected, addDays(today, 8));
    addReminder(expected, addDays(today, 8), 1);
    addNotification(expected, addDays(today, 9));
    addReminder(expected, addDays(today, 9), 1);
    addNotification(expected, addDays(today, 10));
    addReminder(expected, addDays(today, 10), 1);
    addNotification(expected, addDays(today, 11));
    addReminder(expected, addDays(today, 11), 1);
    addNotification(expected, addDays(today, 12));
    addReminder(expected, addDays(today, 12), 1);
    addNotification(expected, addDays(today, 13));
    addReminder(expected, addDays(today, 13), 1, 'invalid-period');

    const expectedResult: EventNotificationDescribers = {
      eventId: 'mock-event-id',
      eventName: 'For mock-entity-name, ALWAYS, 1 notifications, reminder set',
      notifications: expected,
      scheduleEvent: event,
    };

    expect(result.events).toEqual([expectedResult]);
    expect(result.events[0].notifications.length).toEqual(36);
  });
});

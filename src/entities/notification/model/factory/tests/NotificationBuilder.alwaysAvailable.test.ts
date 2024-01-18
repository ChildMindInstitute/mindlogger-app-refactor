import { addDays, addMonths, subDays, subMonths } from 'date-fns';

import {
  ActivityPipelineType,
  AvailabilityType,
  NotificationTriggerType,
  PeriodicityType,
} from '@app/abstract/lib';
import {
  EventEntity,
  EventNotificationDescribers,
  InactiveReason,
  NotificationDescriber,
  NotificationType,
  ScheduleEvent,
} from '@app/entities/notification/lib';

import {
  createNotificationBuilder,
  INotificationBuilder,
} from '../NotificationBuilder';

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
};

const getTestEvent = (): ScheduleEvent => {
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
      availabilityType: AvailabilityType.ScheduledAccess,
      periodicityType: PeriodicityType.Daily,
      oneTimeCompletion: false,
      endDate: null,
      startDate: null,
      timeFrom: null,
      timeTo: null,
    },
  };
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

const getEventEntity = (event: ScheduleEvent): EventEntity => {
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

const createBuilder = (eventEntity: EventEntity) => {
  return createNotificationBuilder({
    appletId: 'mock-applet-id',
    appletName: 'mock-applet-name',
    completions: {},
    eventEntities: [eventEntity],
    progress: {},
  });
};

const getMockNotificationPattern = () => {
  return {
    activityFlowId: null,
    activityId: 'mock-entity-id',
    appletId: 'mock-applet-id',
    entityName: 'mock-entity-name',
    eventDayString: undefined,
    eventId: 'mock-event-id',
    fallType: 'current-day',
    isActive: true,
    isSpreadInEventSet: false,
    notificationBody: undefined,
    notificationHeader: 'mock-entity-name',
    notificationId: undefined,
    scheduledAt: undefined,
    scheduledAtString: undefined,
    shortId: undefined,
    type: NotificationType.Regular,
  } as unknown as NotificationDescriber;
};

const addSimpleReminder = (
  result: NotificationDescriber[],
  eventDate: Date,
  inactiveDays: number,
  inactiveReason?: 'invalid-period' | 'outdated',
) => {
  const mockNotificationPattern = getMockNotificationPattern();

  const reminderTriggerAt = addDays(new Date(eventDate), inactiveDays);
  reminderTriggerAt.setHours(ReminderHourAt);
  reminderTriggerAt.setMinutes(ReminderMinuteAt);

  let itemToAdd: NotificationDescriber = {
    ...mockNotificationPattern,
    scheduledAt: reminderTriggerAt.getTime(),
    scheduledAtString: reminderTriggerAt.toString(),
    eventDayString: eventDate.toString(),
    fallType:
      inactiveDays === 0
        ? 'current-day'
        : inactiveDays === 1
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

describe('NotificationBuilder: always-available penetrating tests', () => {
  describe('Test non cross-day', () => {
    it('Should return array of 15 notifications when reminder is unset', () => {
      const today = new Date(2024, 0, 3);

      const event = getTestEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Always, today);

      event.scheduledAt = new Date(today);
      event.scheduledAt.setHours(FixedHourAt);
      event.scheduledAt.setMinutes(FixedMinuteAt);

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

    it('Should return array of 30 notifications including reminders when reminder is set and activityIncomplete is 1', () => {
      const today = new Date(2024, 0, 3);

      const event = getTestEvent();
      setNormalSettingsToEvent(event, PeriodicityType.Always, today, true);

      event.scheduledAt = new Date(today);
      event.scheduledAt.setHours(FixedHourAt);
      event.scheduledAt.setMinutes(FixedMinuteAt);

      const eventEntity = getEventEntity(event);

      const builder = createBuilder(eventEntity);
      mockUtilityProps(builder, today);

      const result = builder.build();

      const expected: NotificationDescriber[] = [];

      addSimpleReminder(expected, subDays(today, 7), 1, 'invalid-period');
      addSimpleReminder(expected, subDays(today, 6), 1, 'invalid-period');
      addSimpleReminder(expected, subDays(today, 5), 1, 'invalid-period');
      addSimpleReminder(expected, subDays(today, 4), 1, 'invalid-period');
      addSimpleReminder(expected, subDays(today, 3), 1, 'invalid-period');
      addSimpleReminder(expected, subDays(today, 2), 1, 'outdated');

      addNotification(expected, subDays(today, 1), 'outdated');
      addSimpleReminder(expected, subDays(today, 1), 1);
      addNotification(expected, new Date(today));
      addSimpleReminder(expected, new Date(today), 1);
      addNotification(expected, addDays(today, 1));
      addSimpleReminder(expected, addDays(today, 1), 1);
      addNotification(expected, addDays(today, 2));
      addSimpleReminder(expected, addDays(today, 2), 1);
      addNotification(expected, addDays(today, 3));
      addSimpleReminder(expected, addDays(today, 3), 1);
      addNotification(expected, addDays(today, 4));
      addSimpleReminder(expected, addDays(today, 4), 1);
      addNotification(expected, addDays(today, 5));
      addSimpleReminder(expected, addDays(today, 5), 1);
      addNotification(expected, addDays(today, 6));
      addSimpleReminder(expected, addDays(today, 6), 1);
      addNotification(expected, addDays(today, 7));
      addSimpleReminder(expected, addDays(today, 7), 1);
      addNotification(expected, addDays(today, 8));
      addSimpleReminder(expected, addDays(today, 8), 1);
      addNotification(expected, addDays(today, 9));
      addSimpleReminder(expected, addDays(today, 9), 1);
      addNotification(expected, addDays(today, 10));
      addSimpleReminder(expected, addDays(today, 10), 1);
      addNotification(expected, addDays(today, 11));
      addSimpleReminder(expected, addDays(today, 11), 1);
      addNotification(expected, addDays(today, 12));
      addSimpleReminder(expected, addDays(today, 12), 1);
      addNotification(expected, addDays(today, 13));
      addSimpleReminder(expected, addDays(today, 13), 1, 'invalid-period');

      const expectedResult: EventNotificationDescribers = {
        eventId: 'mock-event-id',
        eventName:
          'For mock-entity-name, ALWAYS, 1 notifications, reminder set',
        notifications: expected,
        scheduleEvent: event,
      };

      expect(result.events).toEqual([expectedResult]);
    });
  });
});

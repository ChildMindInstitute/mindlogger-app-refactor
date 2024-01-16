import { addDays, addHours, addMinutes, subDays, subSeconds } from 'date-fns';

import { AvailabilityType, PeriodicityType } from '@app/abstract/lib';
import {
  InactiveReason,
  NotificationDescriber,
  NotificationType,
  ScheduleEvent,
} from '@app/entities/notification/lib';
import { DatesFromTo } from '@app/shared/lib';

import { NotificationUtility } from '../NotificationUtility';

const AppletId = 'e31c7468-4197-4ed1-a908-72af80d7765f';

const mockUtilityProps = (
  utility: NotificationUtility,
  now: Date,
  addTime = true,
) => {
  const date = new Date(now);

  if (addTime) {
    date.setHours(15);
    date.setMinutes(30);
  }

  //@ts-ignore
  utility.now = new Date(date);
};

const ScheduledAt = new Date(2024, 0, 3, 16, 0);

const getTestNotification = (): NotificationDescriber => {
  return {
    activityFlowId: null,
    activityId: 'mock-activity-id',
    appletId: AppletId,
    entityName: 'mock-entity-name',
    eventId: 'mock-event-id',
    isActive: true,
    notificationBody: 'mock-n-body',
    notificationHeader: 'mock-n-header',
    notificationId: 'mock-n-id',
    scheduledAt: ScheduledAt.getTime(),
    scheduledAtString: ScheduledAt.toString(),
    shortId: 'mock-short-id',
    type: NotificationType.Regular,
  };
};

const getTestEvent = (): ScheduleEvent => {
  return {
    entityId: 'mock-entity-id',
    id: 'mock-id',
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

describe('NotificationUtility: mark-as-inactive methods tests', () => {
  describe('Test markNotificationIfActivityCompleted', () => {
    it('Should not mark when activity is not completed', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      //@ts-ignore
      utility.getActivityCompletedAt = jest.fn().mockReturnValue(null);

      const notification = getTestNotification();

      const interval: DatesFromTo = {
        from: new Date(today),
        to: new Date(today),
      };

      utility.markNotificationIfActivityCompleted(
        'mock-entity-id',
        'mock-event-id',
        notification,
        interval,
      );

      expect(notification.isActive).toEqual(true);
    });

    it('Should mark when activity is completed and completedAt is between interval from-to values', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const completedAt = new Date(today);
      completedAt.setHours(16);

      //@ts-ignore
      utility.getActivityCompletedAt = jest.fn().mockReturnValue(completedAt);

      const notification = getTestNotification();

      const interval: DatesFromTo = {
        from: new Date(today),
        to: new Date(today),
      };
      interval.from.setHours(15);
      interval.from.setMinutes(30);
      interval.to.setHours(23);
      interval.to.setMinutes(15);

      utility.markNotificationIfActivityCompleted(
        'mock-entity-id',
        'mock-event-id',
        notification,
        interval,
      );

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(
        InactiveReason.ActivityCompleted,
      );
    });

    it('Should mark when activity is completed and completedAt is equal to interval-from value', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const completedAt = new Date(today);
      completedAt.setHours(15);
      completedAt.setMinutes(30);

      //@ts-ignore
      utility.getActivityCompletedAt = jest.fn().mockReturnValue(completedAt);

      const notification = getTestNotification();

      const interval: DatesFromTo = {
        from: new Date(today),
        to: new Date(today),
      };
      interval.from.setHours(15);
      interval.from.setMinutes(30);
      interval.to.setHours(23);
      interval.to.setMinutes(15);

      utility.markNotificationIfActivityCompleted(
        'mock-entity-id',
        'mock-event-id',
        notification,
        interval,
      );

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(
        InactiveReason.ActivityCompleted,
      );
    });

    it('Should not mark when activity is completed and completedAt is equal to interval-to value', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const completedAt = new Date(today);
      completedAt.setHours(23);
      completedAt.setMinutes(15);

      //@ts-ignore
      utility.getActivityCompletedAt = jest.fn().mockReturnValue(completedAt);

      const notification = getTestNotification();

      const interval: DatesFromTo = {
        from: new Date(today),
        to: new Date(today),
      };
      interval.from.setHours(15);
      interval.from.setMinutes(30);
      interval.to.setHours(23);
      interval.to.setMinutes(15);

      utility.markNotificationIfActivityCompleted(
        'mock-entity-id',
        'mock-event-id',
        notification,
        interval,
      );

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when activity is completed and completedAt is less than interval-from value', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const completedAt = new Date(today);
      completedAt.setHours(12);

      //@ts-ignore
      utility.getActivityCompletedAt = jest.fn().mockReturnValue(completedAt);

      const notification = getTestNotification();

      const interval: DatesFromTo = {
        from: new Date(today),
        to: new Date(today),
      };
      interval.from.setHours(15);
      interval.from.setMinutes(30);
      interval.to.setHours(23);
      interval.to.setMinutes(15);

      utility.markNotificationIfActivityCompleted(
        'mock-entity-id',
        'mock-event-id',
        notification,
        interval,
      );

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when activity is completed and completedAt is greater than interval-to value', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const completedAt = new Date(today);
      completedAt.setHours(23);
      completedAt.setMinutes(48);

      //@ts-ignore
      utility.getActivityCompletedAt = jest.fn().mockReturnValue(completedAt);

      const notification = getTestNotification();

      const interval: DatesFromTo = {
        from: new Date(today),
        to: new Date(today),
      };
      interval.from.setHours(15);
      interval.from.setMinutes(30);
      interval.to.setHours(23);
      interval.to.setMinutes(15);

      utility.markNotificationIfActivityCompleted(
        'mock-entity-id',
        'mock-event-id',
        notification,
        interval,
      );

      expect(notification.isActive).toEqual(true);
    });
  });

  describe('Test markNotificationsDueToOneTimeCompletionSetting', () => {
    it('Should not mark when activity is not completed and isOneTimeCompletion is true', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      //@ts-ignore
      utility.getActivityCompletedAt = jest.fn().mockReturnValue(null);

      const notification = getTestNotification();

      utility.markNotificationsDueToOneTimeCompletionSetting(
        [notification],
        'mock-entity-id',
        'mock-event-id',
        true,
      );

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when activity is not completed and isOneTimeCompletion is false', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      //@ts-ignore
      utility.getActivityCompletedAt = jest.fn().mockReturnValue(null);

      const notification = getTestNotification();

      utility.markNotificationsDueToOneTimeCompletionSetting(
        [notification],
        'mock-entity-id',
        'mock-event-id',
        false,
      );

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when activity is completed and isOneTimeCompletion is false', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      //@ts-ignore
      utility.getActivityCompletedAt = jest
        .fn()
        .mockReturnValue(new Date(today));

      const notification = getTestNotification();

      utility.markNotificationsDueToOneTimeCompletionSetting(
        [notification],
        'mock-entity-id',
        'mock-event-id',
        false,
      );

      expect(notification.isActive).toEqual(true);
    });

    it('Should mark when activity is completed and isOneTimeCompletion is true', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      //@ts-ignore
      utility.getActivityCompletedAt = jest
        .fn()
        .mockReturnValue(new Date(today));

      const notification = getTestNotification();

      utility.markNotificationsDueToOneTimeCompletionSetting(
        [notification],
        'mock-entity-id',
        'mock-event-id',
        true,
      );

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(
        InactiveReason.OneTimeCompletion,
      );
    });
  });

  describe('Test markIfNotificationOutdated', () => {
    it('Should not mark when notification.scheduledAt > now and event-startDate is null', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = addHours(now, 1).getTime();

      const event = getTestEvent();
      event.availability.startDate = null;

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when notification.scheduledAt is the same as now and event-startDate is null', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = now.getTime();

      const event = getTestEvent();
      event.availability.startDate = null;

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when notification.scheduledAt > now and event-startDate < notification.scheduledAt', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = addHours(now, 1).getTime();

      const event = getTestEvent();
      event.availability.startDate = subDays(today, 2);

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when notification.scheduledAt > now and event-startDate is the same as notification.scheduledAt', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = addDays(today, 1).getTime();

      const event = getTestEvent();
      event.availability.startDate = addDays(today, 1);

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should mark when notification.scheduledAt < now and event-startDate is null', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = subSeconds(now, 1).getTime();

      const event = getTestEvent();
      event.availability.startDate = null;

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(InactiveReason.Outdated);
    });

    it('Should mark when notification.scheduledAt > now and event-startDate > notification.scheduledAt', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = addMinutes(now, 10).getTime();

      const event = getTestEvent();
      event.availability.startDate = addDays(today, 1);

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(
        InactiveReason.OutdatedByStartTime,
      );
    });
  });

  describe('Test markIfIsOutOfStartEndDatesRange', () => {
    it('Should not mark when event-startDate is null', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = addHours(now, 1).getTime();

      const event = getTestEvent();
      event.availability.startDate = null;
      event.availability.endDate = addDays(today, 10);

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when event-endDate is null', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = addHours(now, 1).getTime();

      const event = getTestEvent();
      event.availability.startDate = addDays(today, 10);
      event.availability.endDate = null;

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when notification-scheduledAt is equal to event-startDate', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = subDays(today, 1).getTime();

      const event = getTestEvent();
      event.availability.startDate = subDays(today, 1);
      event.availability.endDate = addDays(today, 1);

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when notification-scheduledAt is equal to event-endDate', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = addDays(today, 1).getTime();

      const event = getTestEvent();
      event.availability.startDate = subDays(today, 1);
      event.availability.endDate = addDays(today, 1);

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should mark when notification-scheduledAt is less than event-startDate', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = subDays(today, 2).getTime();

      const event = getTestEvent();
      event.availability.startDate = subDays(today, 1);
      event.availability.endDate = addDays(today, 1);

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(
        InactiveReason.OutOfStartEndDay,
      );
    });

    it('Should mark when notification-scheduledAt is greater than event-endDate', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      const now = new Date(today);
      now.setHours(18);
      now.setMinutes(10);

      mockUtilityProps(utility, now, false);

      const notification = getTestNotification();

      notification.scheduledAt = addDays(today, 2).getTime();

      const event = getTestEvent();
      event.availability.startDate = subDays(today, 1);
      event.availability.endDate = addDays(today, 1);

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(
        InactiveReason.OutOfStartEndDay,
      );
    });
  });
});

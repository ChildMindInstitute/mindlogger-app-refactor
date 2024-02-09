import { addDays, addHours, addMinutes, subDays, subSeconds } from 'date-fns';

import { InactiveReason, NotificationDescriber, NotificationType } from '@app/entities/notification/lib';
import { DatesFromTo } from '@app/shared/lib';

import { addTime, getEmptyEvent } from './testHelpers';
import { NotificationUtility } from '../NotificationUtility';

const AppletId = 'e31c7468-4197-4ed1-a908-72af80d7765f';

const mockUtilityProps = (utility: NotificationUtility, now: Date) => {
  //@ts-ignore
  utility.now = new Date(now);
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

describe('NotificationUtility: mark-as-inactive methods tests', () => {
  describe('Test markNotificationIfActivityCompleted', () => {
    it('Should not mark when activity is not completed', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      //@ts-ignore
      utility.getActivityCompletedAt = jest.fn().mockReturnValue(null);

      const notification = getTestNotification();

      const interval: DatesFromTo = {
        from: new Date(today),
        to: new Date(today),
      };

      utility.markNotificationIfActivityCompleted('mock-entity-id', 'mock-event-id', notification, interval);

      expect(notification.isActive).toEqual(true);
    });

    it('Should mark when activity is completed and completedAt is between interval from-to values', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

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

      utility.markNotificationIfActivityCompleted('mock-entity-id', 'mock-event-id', notification, interval);

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(InactiveReason.ActivityCompleted);
    });

    it('Should mark when activity is completed and completedAt is equal to interval-from value', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

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

      utility.markNotificationIfActivityCompleted('mock-entity-id', 'mock-event-id', notification, interval);

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(InactiveReason.ActivityCompleted);
    });

    it('Should not mark when activity is completed and completedAt is equal to interval-to value', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

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

      utility.markNotificationIfActivityCompleted('mock-entity-id', 'mock-event-id', notification, interval);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when activity is completed and completedAt is less than interval-from value', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

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

      utility.markNotificationIfActivityCompleted('mock-entity-id', 'mock-event-id', notification, interval);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when activity is completed and completedAt is greater than interval-to value', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

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

      utility.markNotificationIfActivityCompleted('mock-entity-id', 'mock-event-id', notification, interval);

      expect(notification.isActive).toEqual(true);
    });
  });

  describe('Test markIfNotificationOutdated', () => {
    it('Should not mark when notification.scheduledAt > now and event-startDate is null', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = addHours(now, 1).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = null;

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when notification.scheduledAt is the same as now and event-startDate is null', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = now.getTime();

      const event = getEmptyEvent();
      event.availability.startDate = null;

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when notification.scheduledAt > now and event-startDate < notification.scheduledAt', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = addHours(now, 1).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = subDays(today, 2);

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when notification.scheduledAt > now and event-startDate is the same as notification.scheduledAt', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = addDays(today, 1).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = addDays(today, 1);

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should mark when notification.scheduledAt < now and event-startDate is null', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = subSeconds(now, 1).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = null;

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(InactiveReason.Outdated);
    });

    it('Should mark when notification.scheduledAt > now and event-startDate > notification.scheduledAt', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = addMinutes(now, 10).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = addDays(today, 1);

      utility.markIfNotificationOutdated(notification, event);

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(InactiveReason.OutdatedByStartTime);
    });
  });

  describe('Test markIfIsOutOfStartEndDatesRange', () => {
    it('Should not mark when event-startDate is null', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = addHours(now, 1).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = null;
      event.availability.endDate = addDays(today, 10);

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when event-endDate is null', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = addHours(now, 1).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = addDays(today, 10);
      event.availability.endDate = null;

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when notification-scheduledAt is equal to event-startDate', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = subDays(today, 1).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = subDays(today, 1);
      event.availability.endDate = addDays(today, 1);

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should not mark when notification-scheduledAt is equal to event-endDate', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = addDays(today, 1).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = subDays(today, 1);
      event.availability.endDate = addDays(today, 1);

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(true);
    });

    it('Should mark when notification-scheduledAt is less than event-startDate', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = subDays(today, 2).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = subDays(today, 1);
      event.availability.endDate = addDays(today, 1);

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(InactiveReason.OutOfStartEndDay);
    });

    it('Should mark when notification-scheduledAt is greater than event-endDate', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 18, minutes: 10 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const notification = getTestNotification();

      notification.scheduledAt = addDays(today, 2).getTime();

      const event = getEmptyEvent();
      event.availability.startDate = subDays(today, 1);
      event.availability.endDate = addDays(today, 1);

      utility.markIfIsOutOfStartEndDatesRange(notification, event);

      expect(notification.isActive).toEqual(false);
      expect(notification.inactiveReason).toEqual(InactiveReason.OutOfStartEndDay);
    });
  });
});

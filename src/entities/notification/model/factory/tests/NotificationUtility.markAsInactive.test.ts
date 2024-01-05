import {
  InactiveReason,
  NotificationDescriber,
  NotificationType,
} from '@app/entities/notification/lib';
import { DatesFromTo } from '@app/shared/lib';

import { NotificationUtility } from '../NotificationUtility';

const AppletId = 'e31c7468-4197-4ed1-a908-72af80d7765f';

const mockUtilityProps = (utility: NotificationUtility, currentDay: Date) => {
  const now = new Date(currentDay);

  now.setHours(15);
  now.setMinutes(30);

  //@ts-ignore
  utility.now = new Date(now);
};

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
    scheduledAt: Date.now(),
    scheduledAtString: new Date().toString(),
    shortId: 'mock-short-id',
    type: NotificationType.Regular,
  };
};

describe('NotificationUtility: mark as inactive methods tests', () => {
  describe('Test markNotificationIfActivityCompleted', () => {
    it('Should not mark when activity is not completed', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      //@ts-ignore
      utility.getActivityCompletedAt = jest.fn().mockReturnValue(null);

      const notification = getTestNotification();

      const interval: DatesFromTo = {
        from: new Date(),
        to: new Date(),
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
});

import { NotificationTriggerType } from '@app/abstract/lib';
import { ScheduleEvent } from '@app/entities/notification/lib';

import { NotificationUtility } from '../NotificationUtility';

const AppletId = 'e31c7468-4197-4ed1-a908-72af80d7765f';

const mockUtilityProps = (utility: NotificationUtility, currentDay: Date) => {
  const now = new Date(currentDay);

  now.setHours(15);
  now.setMinutes(30);

  //@ts-ignore
  utility.now = new Date(now);
};

describe('NotificationUtility: test getRandomBorderType', () => {
  describe('Test current-day events', () => {
    it('Should return both-in-current-day when event timeFrom is 20:15 and timeTo is 22:45 and notification setting from is 20:15 and to is 22:45', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const borderType = utility.getRandomBorderType(
        {
          availability: {
            timeFrom: {
              hours: 20,
              minutes: 15,
            },
            timeTo: { hours: 22, minutes: 45 },
          },
        } as ScheduleEvent,
        {
          from: {
            hours: 20,
            minutes: 15,
          },
          to: {
            hours: 22,
            minutes: 45,
          },
          at: null,
          triggerType: NotificationTriggerType.RANDOM,
        },
      );

      expect(borderType).toEqual('both-in-current-day');
    });

    it('Should return both-in-current-day when event timeFrom is 20:15 and timeTo is 22:45 and notification setting from is 20:30 and to is 22:30', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const borderType = utility.getRandomBorderType(
        {
          availability: {
            timeFrom: {
              hours: 20,
              minutes: 15,
            },
            timeTo: { hours: 22, minutes: 45 },
          },
        } as ScheduleEvent,
        {
          from: {
            hours: 20,
            minutes: 30,
          },
          to: {
            hours: 22,
            minutes: 30,
          },
          at: null,
          triggerType: NotificationTriggerType.RANDOM,
        },
      );

      expect(borderType).toEqual('both-in-current-day');
    });
  });

  describe('Test cross-day events', () => {
    it('Should return both-in-current-day when event timeFrom is 20:15 and timeTo is 03:45 and notification setting from is 20:15 and to is 23:59', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const borderType = utility.getRandomBorderType(
        {
          availability: {
            timeFrom: {
              hours: 20,
              minutes: 15,
            },
            timeTo: { hours: 3, minutes: 45 },
          },
        } as ScheduleEvent,
        {
          from: {
            hours: 20,
            minutes: 15,
          },
          to: {
            hours: 23,
            minutes: 59,
          },
          at: null,
          triggerType: NotificationTriggerType.RANDOM,
        },
      );

      expect(borderType).toEqual('both-in-current-day');
    });

    it('Should return both-in-current-day when event timeFrom is 20:15 and timeTo is 03:45 and notification setting from is 20:30 and to is 23:30', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const borderType = utility.getRandomBorderType(
        {
          availability: {
            timeFrom: {
              hours: 20,
              minutes: 15,
            },
            timeTo: { hours: 3, minutes: 45 },
          },
        } as ScheduleEvent,
        {
          from: {
            hours: 20,
            minutes: 30,
          },
          to: {
            hours: 23,
            minutes: 30,
          },
          at: null,
          triggerType: NotificationTriggerType.RANDOM,
        },
      );

      expect(borderType).toEqual('both-in-current-day');
    });

    it('Should return from-current-to-next when event timeFrom is 20:15 and timeTo is 03:45 and notification setting from is 20:15 and to is 00:00', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const borderType = utility.getRandomBorderType(
        {
          availability: {
            timeFrom: {
              hours: 20,
              minutes: 15,
            },
            timeTo: { hours: 3, minutes: 45 },
          },
        } as ScheduleEvent,
        {
          from: {
            hours: 20,
            minutes: 15,
          },
          to: {
            hours: 0,
            minutes: 0,
          },
          at: null,
          triggerType: NotificationTriggerType.RANDOM,
        },
      );

      expect(borderType).toEqual('from-current-to-next');
    });

    it('Should return from-current-to-next when event timeFrom is 20:15 and timeTo is 03:45 and notification setting from is 22:20 and to is 01:10', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const borderType = utility.getRandomBorderType(
        {
          availability: {
            timeFrom: {
              hours: 20,
              minutes: 15,
            },
            timeTo: { hours: 3, minutes: 45 },
          },
        } as ScheduleEvent,
        {
          from: {
            hours: 22,
            minutes: 20,
          },
          to: {
            hours: 1,
            minutes: 10,
          },
          at: null,
          triggerType: NotificationTriggerType.RANDOM,
        },
      );

      expect(borderType).toEqual('from-current-to-next');
    });

    it('Should return from-current-to-next when event timeFrom is 20:15 and timeTo is 03:45 and notification setting from is 20:15 and to is 03:45', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const borderType = utility.getRandomBorderType(
        {
          availability: {
            timeFrom: {
              hours: 20,
              minutes: 15,
            },
            timeTo: { hours: 3, minutes: 45 },
          },
        } as ScheduleEvent,
        {
          from: {
            hours: 22,
            minutes: 15,
          },
          to: {
            hours: 3,
            minutes: 45,
          },
          at: null,
          triggerType: NotificationTriggerType.RANDOM,
        },
      );

      expect(borderType).toEqual('from-current-to-next');
    });

    it('Should return both-in-next-day when event timeFrom is 20:15 and timeTo is 03:45 and notification setting from is 00:00 and to is 02:10', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const borderType = utility.getRandomBorderType(
        {
          availability: {
            timeFrom: {
              hours: 20,
              minutes: 15,
            },
            timeTo: { hours: 3, minutes: 45 },
          },
        } as ScheduleEvent,
        {
          from: {
            hours: 0,
            minutes: 0,
          },
          to: {
            hours: 2,
            minutes: 10,
          },
          at: null,
          triggerType: NotificationTriggerType.RANDOM,
        },
      );

      expect(borderType).toEqual('both-in-next-day');
    });

    it('Should return both-in-next-day when event timeFrom is 20:15 and timeTo is 03:45 and notification setting from is 01:00 and to is 02:10', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const borderType = utility.getRandomBorderType(
        {
          availability: {
            timeFrom: {
              hours: 20,
              minutes: 15,
            },
            timeTo: { hours: 3, minutes: 45 },
          },
        } as ScheduleEvent,
        {
          from: {
            hours: 1,
            minutes: 0,
          },
          to: {
            hours: 2,
            minutes: 10,
          },
          at: null,
          triggerType: NotificationTriggerType.RANDOM,
        },
      );

      expect(borderType).toEqual('both-in-next-day');
    });

    it('Should return both-in-next-day when event timeFrom is 20:15 and timeTo is 03:45 and notification setting from is 01:00 and to is 03:45', () => {
      const today = new Date(2024, 0, 3);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, today);

      const borderType = utility.getRandomBorderType(
        {
          availability: {
            timeFrom: {
              hours: 20,
              minutes: 15,
            },
            timeTo: { hours: 3, minutes: 45 },
          },
        } as ScheduleEvent,
        {
          from: {
            hours: 1,
            minutes: 0,
          },
          to: {
            hours: 2,
            minutes: 10,
          },
          at: null,
          triggerType: NotificationTriggerType.RANDOM,
        },
      );

      expect(borderType).toEqual('both-in-next-day');
    });
  });
});

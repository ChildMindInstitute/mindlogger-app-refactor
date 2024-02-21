import { addDays } from 'date-fns';

import { addTime } from './testHelpers';
import { NotificationUtility } from '../NotificationUtility';

const AppletId = 'e31c7468-4197-4ed1-a908-72af80d7765f';

const mockUtilityProps = (utility: NotificationUtility, now: Date) => {
  //@ts-ignore
  utility.now = new Date(now);
};

describe('NotificationUtility: test getTriggerAt methods with taking into account cross-day events.', () => {
  describe('Test fixed notifications', () => {
    it('Should return today + 2 days with set time when isNextDay parameter is false and scheduledDay is today + 2 days', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const scheduledDay = addDays(today, 2);

      const scheduledAt = utility.getTriggerAtForFixed(
        scheduledDay,
        {
          hours: 17,
          minutes: 45,
        },
        false,
      );

      const expected = new Date(scheduledDay);
      expected.setHours(17);
      expected.setMinutes(45);

      expect(scheduledAt).toEqual(expected);
    });

    it('Should return today + 3 days with set time when isNextDay parameter is true and scheduledDay is today + 2 days', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const scheduledDay = addDays(today, 2);

      const scheduledAt = utility.getTriggerAtForFixed(
        scheduledDay,
        {
          hours: 17,
          minutes: 45,
        },
        true,
      );

      let expected = new Date(scheduledDay);
      expected = addDays(expected, 1);
      expected.setHours(17);
      expected.setMinutes(45);

      expect(scheduledAt).toEqual(expected);
    });
  });

  describe('Test random notifications', () => {
    it('Should return tomorrow with set time when both: from and to are in the same current day and scheduledDay is tomorrow', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const scheduledDay = addDays(today, 1);

      const addRandomMs = 1000 * 3600; // 1h
      const mockedFn = jest.fn().mockReturnValue(addRandomMs);
      //@ts-ignore
      utility.getRandomInt = mockedFn;

      const scheduledAt = utility.getTriggerAtForRandom(
        scheduledDay,
        {
          hours: 17,
          minutes: 45,
        },
        {
          hours: 20,
          minutes: 45,
        },
        'both-in-current-day',
      );

      let expected = new Date(scheduledDay);
      expected.setHours(18);
      expected.setMinutes(45);

      expect(scheduledAt).toEqual(expected);

      expect(mockedFn).toHaveBeenCalledWith(3 * 1000 * 3600); //3h
    });

    it('Should return tomorrow + 1 day with set time when both: from and to are in the same next day and scheduledDay is tomorrow', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const scheduledDay = addDays(today, 1);

      const addRandomMs = 1000 * 3600; // 1h
      const mockedFn = jest.fn().mockReturnValue(addRandomMs);
      //@ts-ignore
      utility.getRandomInt = mockedFn;

      const scheduledAt = utility.getTriggerAtForRandom(
        scheduledDay,
        {
          hours: 17,
          minutes: 45,
        },
        {
          hours: 20,
          minutes: 45,
        },
        'both-in-next-day',
      );

      let expected = new Date(scheduledDay);
      expected.setHours(18);
      expected.setMinutes(45);
      expected = addDays(expected, 1);

      expect(scheduledAt).toEqual(expected);

      expect(mockedFn).toHaveBeenCalledWith(3 * 1000 * 3600); //3h
    });

    it('Should return tomorrow + 1 day with set time when from is in the current day and to is in the next day and scheduledDay is tomorrow', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const scheduledDay = addDays(today, 1);

      const addRandomMs = 1000 * 3600; // 1h
      const mockedFn = jest.fn().mockReturnValue(addRandomMs);
      //@ts-ignore
      utility.getRandomInt = mockedFn;

      const scheduledAt = utility.getTriggerAtForRandom(
        scheduledDay,
        {
          hours: 23,
          minutes: 45,
        },
        {
          hours: 2,
          minutes: 45,
        },
        'from-current-to-next',
      );

      let expected = new Date(scheduledDay);
      expected = addDays(expected, 1);
      expected.setHours(0);
      expected.setMinutes(45);

      expect(scheduledAt).toEqual(expected);

      expect(mockedFn).toHaveBeenCalledWith(3 * 1000 * 3600); //3h
    });
  });
});

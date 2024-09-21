import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';

import { PeriodicityType } from '@app/abstract/lib';

import { addTime, getLoggerMock } from './testHelpers';
import { NotificationDaysExtractor } from '../NotificationDaysExtractor';
import { NumberOfDaysForSchedule } from '../NotificationUtility';

const AppletId = 'e31c7468-4197-4ed1-a908-72af80d7765f';

const getDaysForNextTwoWeeks = (
  includeYesterday: boolean,
  currentDay: Date,
): Date[] => {
  const result = [];

  const yesterday = subDays(currentDay, 1);
  includeYesterday && result.push(yesterday);

  for (let i = 1; i <= NumberOfDaysForSchedule; i++) {
    result.push(addDays(yesterday, i));
  }

  return result;
};

const getDays = (from: Date, to: Date): Date[] => {
  const result: Date[] = [];

  if (from > to) {
    return result;
  }

  let current = new Date(from);

  while (current <= to) {
    result.push(current);
    current = addDays(current, 1);
  }

  return result;
};

const mockUtilityProps = (extractor: NotificationDaysExtractor, now: Date) => {
  //@ts-ignore
  extractor.utility.now = new Date(now);
};

const loggerMock = getLoggerMock();

describe('NotificationDaysExtractor tests. Extract days for reminder notifications.', () => {
  let CurrentDay: Date;

  let Tomorrow: Date;

  let Yesterday: Date;

  let LastScheduleDay: Date;

  beforeEach(() => {
    CurrentDay = new Date(2023, 11, 18); // Dec 18, Mon

    Tomorrow = addDays(CurrentDay, 1);

    Yesterday = subDays(CurrentDay, 1);

    LastScheduleDay = addDays(CurrentDay, NumberOfDaysForSchedule - 1);
  });

  describe('Test Always Available event', () => {
    it("Should return days: from a week ago to currentDay + 2 weeks when event's startDate/endDate are nulls", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = getDays(subWeeks(CurrentDay, 1), LastScheduleDay);

      expect(result).toEqual(expected);
    });

    it("Should return 5 days: from currentDay - 2 days to currentDay + 2 days when event's dateFrom is currentDay - 2 days and dateTo is currentDay + 2 days", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 2);
      const eventDayTo = addDays(CurrentDay, 2);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = [
        subDays(CurrentDay, 2),
        subDays(CurrentDay, 1),
        CurrentDay,
        addDays(CurrentDay, 1),
        addDays(CurrentDay, 2),
      ];

      expect(result).toEqual(expected);
    });

    it('Should return days for a last week when startDate is null and endDate is today', () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const eventDayFrom = null;
      const eventDayTo = new Date(CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = getDays(subDays(CurrentDay, 7), CurrentDay);

      expect(result).toEqual(expected);
    });

    it("Should return days: from currentDay - 5 days to yesterday when event's dateFrom is currentDay - 5 days and dateTo is yesterday", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 5);
      const eventDayTo = subDays(CurrentDay, 1);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = getDays(subDays(CurrentDay, 5), Yesterday);

      expect(result).toEqual(expected);
    });

    it("Should return days: today and tomorrow when event's dateFrom is currentDay and dateTo is tomorrow", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(CurrentDay);
      const eventDayTo = addDays(CurrentDay, 1);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = [CurrentDay, Tomorrow];

      expect(result).toEqual(expected);
    });

    it("Should return days: from tomorrow to tomorrow + 2 days when event's dateFrom is tomorrow and dateTo is tomorrow + 2 days", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(Tomorrow);
      const eventDayTo = addDays(Tomorrow, 2);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = [Tomorrow, addDays(Tomorrow, 1), addDays(Tomorrow, 2)];

      expect(result).toEqual(expected);
    });

    it("Should return days: from tomorrow to currentDay + NumberOfDaysForSchedule days when event's dateFrom is tomorrow and dateTo is null", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(Tomorrow);
      const eventDayTo = null;

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      let expected = getDaysForNextTwoWeeks(false, CurrentDay);
      expected = expected.filter(d => d >= eventDayFrom);

      expect(result).toEqual(expected);
      expect(result.length).toEqual(NumberOfDaysForSchedule - 1);
    });
  });

  describe('Test Daily event', () => {
    it("Should return days: from a week ago to currentDay + 2 weeks when event's startDate/endDate are nulls", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Daily,
        scheduledDay,
      );

      const expected = getDays(subWeeks(CurrentDay, 1), LastScheduleDay);

      expect(result).toEqual(expected);
    });

    it("Should return empty array when event's startDate/endDate are nulls and scheduledDay is (currentDay -3 months)", () => {
      const scheduledDay = subMonths(CurrentDay, 3);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Daily,
        scheduledDay,
      );

      expect(result).toEqual([]);
    });

    it("Should return 5 days: from currentDay - 2 days to currentDay + 2 days when event's dateFrom is currentDay - 2 days and dateTo is currentDay + 2 days", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 2);
      const eventDayTo = addDays(CurrentDay, 2);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Daily,
        scheduledDay,
      );

      const expected = [
        subDays(CurrentDay, 2),
        subDays(CurrentDay, 1),
        CurrentDay,
        addDays(CurrentDay, 1),
        addDays(CurrentDay, 2),
      ];

      expect(result).toEqual(expected);
    });

    it('Should return days for a last week when startDate is null and endDate is today', () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const eventDayFrom = null;
      const eventDayTo = new Date(CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Daily,
        scheduledDay,
      );

      const expected = getDays(subDays(CurrentDay, 7), CurrentDay);

      expect(result).toEqual(expected);
    });

    it("Should return days: from currentDay - 5 days to yesterday when event's dateFrom is currentDay - 5 days and dateTo is yesterday", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 5);
      const eventDayTo = subDays(CurrentDay, 1);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Daily,
        scheduledDay,
      );

      const expected = getDays(subDays(CurrentDay, 5), Yesterday);

      expect(result).toEqual(expected);
    });

    it("Should return days: today and tomorrow when event's dateFrom is currentDay and dateTo is tomorrow", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(CurrentDay);
      const eventDayTo = addDays(CurrentDay, 1);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Daily,
        scheduledDay,
      );

      const expected = [CurrentDay, Tomorrow];

      expect(result).toEqual(expected);
    });

    it("Should return days: from tomorrow to tomorrow + 2 days when event's dateFrom is tomorrow and dateTo is tomorrow + 2 days", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(Tomorrow);
      const eventDayTo = addDays(Tomorrow, 2);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Daily,
        scheduledDay,
      );

      const expected = [Tomorrow, addDays(Tomorrow, 1), addDays(Tomorrow, 2)];

      expect(result).toEqual(expected);
    });

    it("Should return days: from tomorrow to currentDay + NumberOfDaysForSchedule days when event's dateFrom is tomorrow and dateTo is null", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(Tomorrow);
      const eventDayTo = null;

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Daily,
        scheduledDay,
      );

      let expected = getDaysForNextTwoWeeks(false, CurrentDay);
      expected = expected.filter(d => d >= eventDayFrom);

      expect(result).toEqual(expected);
      expect(result.length).toEqual(NumberOfDaysForSchedule - 1);
    });
  });

  describe('Test Weekly event', () => {
    it("Should return days: scheduledDay - 4,3,2,1 weeks, scheduledDay, scheduledDay + 1 week, scheduledDay + 2 weeks when event's startDate/endDate are nulls and scheduledDay is currentDay - 3 days", () => {
      const scheduledDay = subDays(CurrentDay, 3);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Weekly,
        scheduledDay,
      );

      const expected = [
        subWeeks(scheduledDay, 4),
        subWeeks(scheduledDay, 3),
        subWeeks(scheduledDay, 2),
        subWeeks(scheduledDay, 1),
        scheduledDay,
        addWeeks(scheduledDay, 1),
        addWeeks(scheduledDay, 2),
      ];

      expect(result).toEqual(expected);
    });

    it("Should return 1 day: scheduledDay + 7 days when event's dateFrom is currentDay - 2 days and dateTo is currentDay + 5 days and scheduledDay is currentDay - 3 days", () => {
      const scheduledDay = subDays(CurrentDay, 3);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 2);
      const eventDayTo = addDays(CurrentDay, 5);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekly,
        scheduledDay,
      );

      const expected = [addDays(scheduledDay, 7)];

      expect(result).toEqual(expected);
    });

    it("Should return days: scheduledDay + 7 days, scheduledDay + 14 days when event's dateFrom is currentDay - 2 days and dateTo is null and scheduledDay is currentDay - 3 days", () => {
      const scheduledDay = subDays(CurrentDay, 3);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 2);
      const eventDayTo = null;

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekly,
        scheduledDay,
      );

      const expected = [addDays(scheduledDay, 7), addDays(scheduledDay, 14)];

      expect(result).toEqual(expected);
    });

    it("Should return days: scheduledDay - 4,3,2,1 weeks, scheduledDay, scheduledDay + 1 week when event's dateFrom is null and dateTo is currentDay + 5 days and scheduledDay is currentDay - 3 days", () => {
      const scheduledDay = subDays(CurrentDay, 3);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = null;
      const eventDayTo = addDays(CurrentDay, 5);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekly,
        scheduledDay,
      );

      const expected = [
        subWeeks(scheduledDay, 4),
        subWeeks(scheduledDay, 3),
        subWeeks(scheduledDay, 2),
        subWeeks(scheduledDay, 1),
        scheduledDay,
        addWeeks(scheduledDay, 1),
      ];

      expect(result).toEqual(expected);
    });

    it("Should return 1 day: scheduledDay + 1 week when event's dateFrom is currentDay + 1 day and dateTo is currentDay + 5 days and scheduledDay is currentDay - 3 days", () => {
      const scheduledDay = subDays(CurrentDay, 3);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = addDays(CurrentDay, 1);
      const eventDayTo = addDays(CurrentDay, 5);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekly,
        scheduledDay,
      );

      const expected = [addDays(scheduledDay, 7)];

      expect(result).toEqual(expected);
    });
  });

  describe('Test Weekdays event', () => {
    it("Should return 15 days (3 weeks excluding weekends) when event's startDate/endDate are nulls and scheduledDay is currentDay", () => {
      const scheduledDay = new Date(CurrentDay);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Weekdays,
        scheduledDay,
      );

      const expected = [
        subDays(scheduledDay, 7),
        subDays(scheduledDay, 6),
        subDays(scheduledDay, 5),
        subDays(scheduledDay, 4),
        subDays(scheduledDay, 3),

        scheduledDay,
        addDays(scheduledDay, 1),
        addDays(scheduledDay, 2),
        addDays(scheduledDay, 3),
        addDays(scheduledDay, 4),

        addDays(scheduledDay, 7),
        addDays(scheduledDay, 8),
        addDays(scheduledDay, 9),
        addDays(scheduledDay, 10),
        addDays(scheduledDay, 11),
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('Test Monthly event', () => {
    it("Should return days: scheduledDay - 2, 1 months, scheduledDay, scheduledDay + 1 month when event's startDate/endDate are nulls and scheduledDay is currentDay - 35 days", () => {
      const scheduledDay = subDays(CurrentDay, 35);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [
        subMonths(scheduledDay, 2),
        subMonths(scheduledDay, 1),
        scheduledDay,
        addMonths(scheduledDay, 1),
      ];

      expect(result).toEqual(expected);
    });

    it("Should return days: scheduledDay - 2, 1 months, scheduledDay, scheduledDay + 1 month when event's startDate/endDate are nulls and scheduledDay is currentDay - 25 days", () => {
      const scheduledDay = subDays(CurrentDay, 25);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [
        subMonths(scheduledDay, 2),
        subMonths(scheduledDay, 1),
        scheduledDay,
        addMonths(scheduledDay, 1),
      ];

      expect(result).toEqual(expected);
    });

    it("Should return 3 days: scheduledDay - 2, 1 months, scheduledDay when event's startDate/endDate are nulls and scheduledDay is currentDay", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [
        subMonths(scheduledDay, 2),
        subMonths(scheduledDay, 1),
        scheduledDay,
      ];

      expect(result).toEqual(expected);
    });

    it("Should return 3 days: scheduledDay - 2, 1 months, scheduledDay when event's startDate/endDate are nulls and scheduledDay is currentDay + 10 days", () => {
      const scheduledDay = addDays(CurrentDay, 10);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [
        subMonths(scheduledDay, 2),
        subMonths(scheduledDay, 1),
        scheduledDay,
      ];

      expect(result).toEqual(expected);
    });

    it("Should return 2 days: scheduledDay - 2, 1 months when event's startDate/endDate are nulls and scheduledDay is currentDay + 20 days", () => {
      const scheduledDay = addDays(CurrentDay, 20);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [subMonths(scheduledDay, 2), subMonths(scheduledDay, 1)];

      expect(result).toEqual(expected);
    });

    it('Should return scheduledDay + 1 month when startDate is currentDay - 15 days and endDate is null and scheduledDay is currentDay - 25 days', () => {
      const scheduledDay = subDays(CurrentDay, 25);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const startDate = subDays(CurrentDay, 15);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        startDate,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [addMonths(scheduledDay, 1)];

      expect(result).toEqual(expected);
    });

    it("Should return 3 days: scheduledDay - 2, 1 months, scheduledDay when event's startDate is null and endDate is currentDay and scheduledDay is currentDay - 25 days", () => {
      const scheduledDay = subDays(CurrentDay, 25);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const endDate = new Date(CurrentDay);

      const result = extractor.extractForReminders(
        LastScheduleDay,
        null,
        endDate,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [
        subMonths(scheduledDay, 2),
        subMonths(scheduledDay, 1),
        scheduledDay,
      ];

      expect(result).toEqual(expected);
    });
  });
});

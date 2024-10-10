import { addDays, addMonths, addWeeks, subDays } from 'date-fns';

import { PeriodicityType } from '@app/abstract/lib/types/event';

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

const mockUtilityProps = (extractor: NotificationDaysExtractor, now: Date) => {
  //@ts-ignore
  extractor.utility.now = new Date(now);
};

const loggerMock = getLoggerMock();

describe('NotificationDaysExtractor tests. Extract days for regular notifications.', () => {
  let CurrentDay: Date;

  let Tomorrow: Date;

  let Yesterday: Date;

  let FirstScheduleDay: Date;

  let LastScheduleDay: Date;

  beforeEach(() => {
    CurrentDay = new Date(2023, 11, 18); // Dec 18, Mon

    Tomorrow = addDays(CurrentDay, 1);

    Yesterday = subDays(CurrentDay, 1);

    FirstScheduleDay = new Date(CurrentDay);

    LastScheduleDay = addDays(CurrentDay, NumberOfDaysForSchedule - 1);
  });

  describe('Test Always Available event', () => {
    it("Should return days for next two weeks + yesterday when event's startDate/endDate are nulls", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = getDaysForNextTwoWeeks(true, CurrentDay);

      expect(result).toEqual(expected);
    });

    it("Should return 4 days: from yesterday to the day after tomorrow when event's dateFrom is currentDay - 2 days and dateTo is currentDay + 2 days", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 2);
      const eventDayTo = addDays(CurrentDay, 2);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = [
        Yesterday,
        CurrentDay,
        addDays(CurrentDay, 1),
        addDays(CurrentDay, 2),
      ];

      expect(result).toEqual(expected);
    });

    it('Should return days: yesterday, today when startDate is null and endDate is today', () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const eventDayFrom = null;
      const eventDayTo = new Date(CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = [Yesterday, CurrentDay];

      expect(result).toEqual(expected);
    });

    it("Should return yesterday when event's dateFrom is currentDay - 5 days and dateTo is yesterday", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 5);
      const eventDayTo = subDays(CurrentDay, 1);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = [Yesterday];

      expect(result).toEqual(expected);
    });

    it("Should return empty array when event's dateFrom is currentDay - 5 days and dateTo is currentDay - 2 days", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 5);
      const eventDayTo = subDays(CurrentDay, 2);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      expect(result).toEqual([]);
    });

    it("Should return days: today and tomorrow when event's dateFrom is currentDay and dateTo is tomorrow", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(CurrentDay);
      const eventDayTo = addDays(CurrentDay, 1);

      const result = extractor.extract(
        FirstScheduleDay,
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

      const result = extractor.extract(
        FirstScheduleDay,
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

      const result = extractor.extract(
        FirstScheduleDay,
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

    it('Should return 2 days: eventDayFrom, eventDayTo when eventDayFrom is tomorrow and eventDayTo is (tomorrow + 1 day) and lastScheduleDay is (currentDay + 2 weeks)', () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(Tomorrow);
      const eventDayTo = addDays(eventDayFrom, 1);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      expect(result).toEqual([eventDayFrom, eventDayTo]);
    });

    it('Should return 2 days: eventDayFrom, eventDayTo when eventDayFrom is tomorrow and eventDayTo is (tomorrow + 2 day) and lastScheduleDay is (tomorrow + 1 day)', () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(Tomorrow);
      const eventDayTo = addDays(eventDayFrom, 2);
      const lastScheduleDay = addDays(eventDayFrom, 1);

      const result = extractor.extract(
        FirstScheduleDay,
        lastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      expect(result).toEqual([eventDayFrom, lastScheduleDay]);
    });
  });

  describe('Test Daily event', () => {
    it("Should return days for next two weeks + yesterday when event's startDate/endDate are nulls", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Daily,
        scheduledDay,
      );

      const expected = getDaysForNextTwoWeeks(true, CurrentDay);

      expect(result).toEqual(expected);
    });

    it("Should return 4 days: from yesterday to the day after tomorrow when event's dateFrom is currentDay - 2 days and dateTo is currentDay + 2 days", () => {
      const scheduledDay = CurrentDay;

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, CurrentDay);

      const eventDayFrom = subDays(CurrentDay, 2);
      const eventDayTo = addDays(CurrentDay, 2);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Daily,
        scheduledDay,
      );

      const expected = [
        Yesterday,
        CurrentDay,
        addDays(CurrentDay, 1),
        addDays(CurrentDay, 2),
      ];

      expect(result).toEqual(expected);
    });

    it('Should return days: yesterday, today when startDate is null and endDate is today', () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const eventDayFrom = null;
      const eventDayTo = new Date(CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Daily,
        scheduledDay,
      );

      const expected = [Yesterday, CurrentDay];

      expect(result).toEqual(expected);
    });

    it("Should return yesterday when event's dateFrom is currentDay - 5 days and dateTo is yesterday", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 5);
      const eventDayTo = subDays(CurrentDay, 1);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Daily,
        scheduledDay,
      );

      const expected = [Yesterday];

      expect(result).toEqual(expected);
    });

    it("Should return empty array when event's dateFrom is currentDay - 5 days and dateTo is currentDay - 2 days", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 5);
      const eventDayTo = subDays(CurrentDay, 2);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Daily,
        scheduledDay,
      );

      expect(result).toEqual([]);
    });

    it("Should return days: today and tomorrow when event's dateFrom is currentDay and dateTo is tomorrow", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(CurrentDay);
      const eventDayTo = addDays(CurrentDay, 1);

      const result = extractor.extract(
        FirstScheduleDay,
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

      const result = extractor.extract(
        FirstScheduleDay,
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

      const result = extractor.extract(
        FirstScheduleDay,
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
    it("Should return days: scheduledDay, scheduledDay + 1 week, scheduledDay + 2 weeks when event's startDate/endDate are nulls and scheduledDay is currentDay - 3 days", () => {
      const scheduledDay = subDays(CurrentDay, 3);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Weekly,
        scheduledDay,
      );

      const expected = [
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

      const result = extractor.extract(
        FirstScheduleDay,
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

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekly,
        scheduledDay,
      );

      const expected = [addDays(scheduledDay, 7), addDays(scheduledDay, 14)];

      expect(result).toEqual(expected);
    });

    it("Should return days: scheduledDay, scheduledDay + 7 days when event's dateFrom is null and dateTo is currentDay + 5 days and scheduledDay is currentDay - 3 days", () => {
      const scheduledDay = subDays(CurrentDay, 3);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = null;
      const eventDayTo = addDays(CurrentDay, 5);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekly,
        scheduledDay,
      );

      const expected = [scheduledDay, addDays(scheduledDay, 7)];

      expect(result).toEqual(expected);
    });

    it("Should return 1 day: scheduledDay + 7 days when event's dateFrom is currentDay + 1 day and dateTo is currentDay + 5 days and scheduledDay is currentDay - 3 days", () => {
      const scheduledDay = subDays(CurrentDay, 3);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = addDays(CurrentDay, 1);
      const eventDayTo = addDays(CurrentDay, 5);

      const result = extractor.extract(
        FirstScheduleDay,
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

  describe('Test Weekdays event, currentDay is monday', () => {
    it("Should return days for next two weeks + yesterday except weekends when event's startDate/endDate are nulls", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Weekdays,
        scheduledDay,
      );

      let expected = getDaysForNextTwoWeeks(true, CurrentDay);

      expected = expected.filter(d => d.getDay() >= 1 && d.getDay() <= 5);

      expect(result).toEqual(expected);
      expect(result.length).toEqual(10);
    });

    it("Should return days: currentDay, tomorrow, day after tomorrow when event's dateFrom is currentDay - 2 days and dateTo is currentDay + 2 days", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 2);
      const eventDayTo = addDays(CurrentDay, 2);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekdays,
        scheduledDay,
      );

      const expected = [CurrentDay, Tomorrow, addDays(Tomorrow, 1)];

      expect(result).toEqual(expected);
    });

    it('Should return today when startDate is null and endDate is today', () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const eventDayFrom = null;
      const eventDayTo = new Date(CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekdays,
        scheduledDay,
      );

      const expected = [CurrentDay];

      expect(result).toEqual(expected);
    });

    it("Should return empty when event's dateFrom is currentDay - 5 days and dateTo is yesterday", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = subDays(CurrentDay, 5);
      const eventDayTo = subDays(CurrentDay, 1);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekdays,
        scheduledDay,
      );

      expect(result).toEqual([]);
    });

    it("Should return days: today and tomorrow when event's dateFrom is currentDay and dateTo is tomorrow", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(CurrentDay);
      const eventDayTo = addDays(CurrentDay, 1);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekdays,
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

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Always,
        scheduledDay,
      );

      const expected = [Tomorrow, addDays(Tomorrow, 1), addDays(Tomorrow, 2)];

      expect(result).toEqual(expected);
    });

    it("Should return days: Thu, Fri when event's dateFrom is Thu and dateTo is Sat", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = addDays(CurrentDay, 3);
      const eventDayTo = addDays(CurrentDay, 5);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekdays,
        scheduledDay,
      );

      const expected = [eventDayFrom, addDays(eventDayFrom, 1)];

      expect(result).toEqual(expected);
      expect(eventDayFrom.getDay()).toEqual(4);
    });

    it("Should return days: from tomorrow to currentDay + NumberOfDaysForSchedule except weekends when event's dateFrom is tomorrow and dateTo is null", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const eventDayFrom = new Date(Tomorrow);
      const eventDayTo = null;

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        eventDayFrom,
        eventDayTo,
        PeriodicityType.Weekdays,
        scheduledDay,
      );

      let expected = getDaysForNextTwoWeeks(false, CurrentDay);
      expected = expected.filter(
        d => d >= eventDayFrom && d.getDay() >= 1 && d.getDay() <= 5,
      );

      expect(result).toEqual(expected);
    });
  });

  describe('Test Monthly event', () => {
    it("Should return scheduledDay + 1 month when event's startDate/endDate are nulls and scheduledDay is currentDay - 35 days", () => {
      const scheduledDay = subDays(CurrentDay, 35);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = addMonths(scheduledDay, 1);

      expect(result).toEqual([expected]);
    });

    it("Should return days: scheduledDay, scheduledDay + 1 month when event's startDate/endDate are nulls and scheduledDay is currentDay - 25 days", () => {
      const scheduledDay = subDays(CurrentDay, 25);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [scheduledDay, addMonths(scheduledDay, 1)];

      expect(result).toEqual(expected);
    });

    it("Should return scheduledDay when event's startDate/endDate are nulls and scheduledDay is currentDay", () => {
      const scheduledDay = CurrentDay;
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [scheduledDay];

      expect(result).toEqual(expected);
    });

    it("Should return scheduledDay when event's startDate/endDate are nulls and scheduledDay is currentDay + 10 days", () => {
      const scheduledDay = addDays(CurrentDay, 10);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [scheduledDay];

      expect(result).toEqual(expected);
    });

    it("Should return empty when event's startDate/endDate are nulls and scheduledDay is currentDay + 20 days", () => {
      const scheduledDay = addDays(CurrentDay, 20);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        null,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      expect(result).toEqual([]);
    });

    it('Should return scheduledDay + 1 month when startDate is currentDay - 15 days and endDate is null and scheduledDay is currentDay - 25 days', () => {
      const scheduledDay = subDays(CurrentDay, 25);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const startDate = subDays(CurrentDay, 15);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        startDate,
        null,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [addMonths(scheduledDay, 1)];

      expect(result).toEqual(expected);
    });

    it("Should return scheduledDay when event's startDate is null and endDate is currentDay and scheduledDay is currentDay - 25 days", () => {
      const scheduledDay = subDays(CurrentDay, 25);
      const now = addTime({ hours: 15, minutes: 30 }, CurrentDay);

      const extractor = new NotificationDaysExtractor(AppletId, [], loggerMock);
      mockUtilityProps(extractor, now);

      const endDate = new Date(CurrentDay);

      const result = extractor.extract(
        FirstScheduleDay,
        LastScheduleDay,
        null,
        endDate,
        PeriodicityType.Monthly,
        scheduledDay,
      );

      const expected = [scheduledDay];

      expect(result).toEqual(expected);
    });
  });
});

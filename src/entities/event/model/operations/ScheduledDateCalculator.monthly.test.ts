import { addDays, addMonths, startOfDay, subDays, subMonths } from 'date-fns';

import { AvailabilityType, PeriodicityType } from '@app/abstract/lib';

import { ScheduledDateCalculator } from './ScheduledDateCalculator';
import { ScheduleEvent } from '../../lib/types/scheduledDateCalculator';

describe('ScheduledDateCalculator: test monthly events', () => {
  const getScheduledDateCalculator = (now: Date) => {
    const instance = new ScheduledDateCalculator();
    //@ts-expect-error
    instance.getNow = jest.fn().mockReturnValue(now);
    return instance;
  };

  const getMonthlyEvent = (): ScheduleEvent => {
    const scheduleEvent: ScheduleEvent = {
      id: 'eventTestId',
      entityId: 'entityTestId',
      availability: {
        availabilityType: AvailabilityType.ScheduledAccess,
        periodicityType: PeriodicityType.Monthly,
        timeFrom: { hours: 14, minutes: 0 },
        timeTo: { hours: 18, minutes: 30 },
        startDate: null,
        endDate: null,
      },
      selectedDate: null,
      scheduledAt: null,
    };

    return scheduleEvent;
  };

  describe('Test regular cases', () => {
    const now: Date = new Date(2024, 0, 25);

    const scheduledDateCalculator = getScheduledDateCalculator(now);

    it("Should return today's start of day when selected day is today and is covered by start-end dates and timeFrom is reset", () => {
      const event = getMonthlyEvent();
      event.availability.startDate = subDays(startOfDay(now), 2);
      event.availability.endDate = addDays(startOfDay(now), 2);
      event.availability.timeFrom = { hours: 0, minutes: 0 };
      event.selectedDate = startOfDay(now);

      const resultDate = scheduledDateCalculator.calculate(event, false);

      const expectedDate = startOfDay(now);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return today with timeFrom when selected day is today and covered by start-end dates and timeFrom is set', () => {
      const event = getMonthlyEvent();
      event.availability.startDate = subDays(startOfDay(now), 2);
      event.availability.endDate = addDays(startOfDay(now), 2);
      event.selectedDate = startOfDay(now);

      const resultDate = scheduledDateCalculator.calculate(event, false);

      const expectedDate = startOfDay(now);
      expectedDate.setHours(event.availability.timeFrom!.hours);
      expectedDate.setMinutes(event.availability.timeFrom!.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return date today with timeFrom when selected day is (today + or - 1 month) and timeFrom is set and date start/end are (today -/+ 2 months)', () => {
      const event = getMonthlyEvent();
      event.availability.startDate = subMonths(startOfDay(now), 2);
      event.availability.endDate = addMonths(startOfDay(now), 2);
      event.selectedDate = addMonths(startOfDay(now), 1);

      let resultDate = scheduledDateCalculator.calculate(event, false);

      const expectedDate = startOfDay(now);
      expectedDate.setHours(event.availability.timeFrom!.hours);
      expectedDate.setMinutes(event.availability.timeFrom!.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.selectedDate = subMonths(startOfDay(now), 1);

      resultDate = scheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return a date equal to (tomorrow - 1 month) with set/not set timeFrom when selected date is tomorrow and start/end dates are (today +1/+25 days)', () => {
      const event = getMonthlyEvent();
      event.availability.startDate = addDays(startOfDay(now), 1);
      event.availability.endDate = addDays(startOfDay(now), 25);
      event.selectedDate = addDays(startOfDay(now), 1);

      let resultDate = scheduledDateCalculator.calculate(event, false);

      let expectedDate = subMonths(addDays(startOfDay(now), 1), 1);
      expectedDate.setHours(event.availability.timeFrom!.hours);
      expectedDate.setMinutes(event.availability.timeFrom!.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.timeFrom = { hours: 0, minutes: 0 };

      resultDate = scheduledDateCalculator.calculate(event, false);

      expectedDate = subMonths(addDays(startOfDay(now), 1), 1);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return a date equal to endDate with set/not set timeFrom when selected date is yesterday and start/end dates are (today -25/-1 days)', () => {
      const event = getMonthlyEvent();
      event.availability.startDate = subDays(startOfDay(now), 25);
      event.availability.endDate = subDays(startOfDay(now), 1);
      event.selectedDate = subDays(startOfDay(now), 1);

      let resultDate = scheduledDateCalculator.calculate(event, false);

      let expectedDate = subDays(startOfDay(now), 1);
      expectedDate.setHours(event.availability.timeFrom!.hours);
      expectedDate.setMinutes(event.availability.timeFrom!.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.timeFrom = { hours: 0, minutes: 0 };

      resultDate = scheduledDateCalculator.calculate(event, false);

      expectedDate = subDays(startOfDay(now), 1);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return a date equal to endDate with set/not set timeFrom when selected date is yesterday and start/end dates are (today -55/-1 days)', () => {
      // -2 todo
      const event = getMonthlyEvent();
      event.availability.startDate = subDays(startOfDay(now), 55);
      event.availability.endDate = subDays(startOfDay(now), 1);
      event.selectedDate = subDays(startOfDay(now), 1);

      let resultDate = scheduledDateCalculator.calculate(event, false);

      let expectedDate = subDays(startOfDay(now), 1);
      expectedDate.setHours(event.availability.timeFrom!.hours);
      expectedDate.setMinutes(event.availability.timeFrom!.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.timeFrom = { hours: 0, minutes: 0 };

      resultDate = scheduledDateCalculator.calculate(event, false);

      expectedDate = subDays(startOfDay(now), 1);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return (today + 10 days - 1 month days with timeFrom) when timeFrom is set and selected date is (today + 10 days) and start/end dates -/+ 50 days', () => {
      const event = getMonthlyEvent();
      event.availability.startDate = subDays(startOfDay(now), 50);
      event.availability.endDate = addDays(startOfDay(now), 50);
      event.selectedDate = addDays(startOfDay(now), 10);

      const resultDate = scheduledDateCalculator.calculate(event, false);

      const expectedDate = subMonths(addDays(startOfDay(now), 10), 1);
      expectedDate.setHours(event.availability.timeFrom!.hours);
      expectedDate.setMinutes(event.availability.timeFrom!.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return (today - 4 days with timeFrom) when timeFrom is set and selected date is (today - 4 days) and start/end dates -/+ 50 days', () => {
      const event = getMonthlyEvent();
      event.availability.startDate = subDays(startOfDay(now), 50);
      event.availability.endDate = addDays(startOfDay(now), 50);
      event.selectedDate = subDays(startOfDay(now), 4);

      const resultDate = scheduledDateCalculator.calculate(event, false);

      const expectedDate = subDays(startOfDay(now), 4);
      expectedDate.setHours(event.availability.timeFrom!.hours);
      expectedDate.setMinutes(event.availability.timeFrom!.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return null when selected date is (today - 1 days) and start/end date earlier than (today -1 day)', () => {
      const event = getMonthlyEvent();
      event.availability.startDate = subDays(startOfDay(now), 56);
      event.availability.endDate = subDays(startOfDay(now), 3);
      event.selectedDate = subDays(startOfDay(now), 1);

      const resultDate = scheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(null);
    });
  });

  describe('Test edge cases', () => {
    it('Should return ...', () => {
      const now = new Date(2024, 1, 29);

      const calculator = getScheduledDateCalculator(now);

      const event = getMonthlyEvent();
      event.availability.startDate = subMonths(now, 6);
      event.availability.endDate = addMonths(startOfDay(now), 6);
      event.selectedDate = new Date(2024, 0, 31);

      const resultDate = calculator.calculate(event, false);

      const expectedDate = new Date(2024, 1, 29);
      expectedDate.setHours(event.availability.timeFrom!.hours);
      expectedDate.setMinutes(event.availability.timeFrom!.minutes);

      expect(resultDate).toEqual(expectedDate);
    });
  });
});

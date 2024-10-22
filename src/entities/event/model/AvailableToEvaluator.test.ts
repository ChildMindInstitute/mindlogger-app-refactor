import { addDays } from 'date-fns';

import {
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';

import { AvailableToEvaluator } from './AvailableToEvaluator';
import { ScheduleEvent } from '../lib/types/event';

const getEmptyEvent = (): ScheduleEvent => {
  const event = {
    timers: {
      idleTimer: null,
      timer: null,
    },
    selectedDate: null,
    entityId: 'mock-entity-id-1',
    scheduledAt: null,
    availability: {
      timeFrom: null,
      timeTo: null,
      startDate: null,
      endDate: null,
      periodicityType: PeriodicityType.NotDefined,
      oneTimeCompletion: false,
      availabilityType: AvailabilityType.NotDefined,
      allowAccessBeforeFromTime: false,
    },
    id: 'mock-id-1',
    notificationSettings: {
      notifications: [],
      reminder: null,
    },
  };
  return event;
};

describe('Test AvailableToEvaluator', () => {
  it('Should return null when availabilityType is not scheduled', () => {
    const evaluator = new AvailableToEvaluator({
      isSpreadToNextDay: () => false,
    });

    const event = getEmptyEvent();
    event.availability.availabilityType = AvailabilityType.AlwaysAvailable;
    event.availability.periodicityType = PeriodicityType.Always;

    const result = evaluator.evaluate(event);

    expect(result).toEqual(null);
  });

  const periodicityTypes = [
    PeriodicityType.Daily,
    PeriodicityType.Monthly,
    PeriodicityType.Once,
    PeriodicityType.Weekdays,
    PeriodicityType.Weekly,
  ];

  describe('Test non-cross-day', () => {
    periodicityTypes.forEach(periodicity => {
      it(`Should return date now with set timeTo when periodicity is ${periodicity}`, () => {
        const mockNow = new Date(2023, 5, 7, 15, 5, 25);

        const evaluator = new AvailableToEvaluator({
          isSpreadToNextDay: () => false,
        });

        //@ts-expect-error
        evaluator.getNow = jest.fn().mockReturnValue(mockNow);

        const event = getEmptyEvent();
        event.availability.availabilityType = AvailabilityType.ScheduledAccess;
        event.availability.periodicityType = periodicity;
        event.availability.timeFrom = { hours: 12, minutes: 10 };
        event.availability.timeTo = { hours: 16, minutes: 30 };

        const result = evaluator.evaluate(event);

        const expected = new Date(mockNow);
        expected.setHours(16);
        expected.setMinutes(30);
        expected.setSeconds(0, 0);

        expect(result).toEqual(expected);
      });
    });
  });

  describe('Test cross-day', () => {
    periodicityTypes.forEach(periodicity => {
      it(`Should return date (now + 1 day with set timeTo) when periodicity is ${periodicity} and now's time is equal to timeFrom`, () => {
        const mockNow = new Date(2023, 5, 7, 12, 10, 25);

        const evaluator = new AvailableToEvaluator({
          isSpreadToNextDay: () => true,
        });

        //@ts-expect-error
        evaluator.getNow = jest.fn().mockReturnValue(mockNow);

        const event = getEmptyEvent();
        event.availability.availabilityType = AvailabilityType.ScheduledAccess;
        event.availability.periodicityType = periodicity;
        event.availability.timeFrom = { hours: 12, minutes: 10 };
        event.availability.timeTo = { hours: 9, minutes: 30 };

        const result = evaluator.evaluate(event);

        const expected = addDays(mockNow, 1);

        expected.setHours(9);
        expected.setMinutes(30);
        expected.setSeconds(0, 0);

        expect(result).toEqual(expected);
      });
    });

    periodicityTypes.forEach(periodicity => {
      it(`Should return date (now + 1 day with set timeTo) when periodicity is ${periodicity} and now's time is more than timeFrom`, () => {
        const mockNow = new Date(2023, 5, 7, 15, 5, 25);

        const evaluator = new AvailableToEvaluator({
          isSpreadToNextDay: () => true,
        });

        //@ts-expect-error
        evaluator.getNow = jest.fn().mockReturnValue(mockNow);

        const event = getEmptyEvent();
        event.availability.availabilityType = AvailabilityType.ScheduledAccess;
        event.availability.periodicityType = periodicity;
        event.availability.timeFrom = { hours: 12, minutes: 10 };
        event.availability.timeTo = { hours: 9, minutes: 30 };

        const result = evaluator.evaluate(event);

        const expected = addDays(mockNow, 1);

        expected.setHours(9);
        expected.setMinutes(30);
        expected.setSeconds(0, 0);

        expect(result).toEqual(expected);
      });
    });

    periodicityTypes.forEach(periodicity => {
      it(`Should return date (now with set timeTo) when periodicity is ${periodicity} and now is less than timeTo`, () => {
        const mockNow = new Date(2023, 5, 7, 8, 0, 25);

        const evaluator = new AvailableToEvaluator({
          isSpreadToNextDay: () => true,
        });

        //@ts-expect-error
        evaluator.getNow = jest.fn().mockReturnValue(mockNow);

        const event = getEmptyEvent();
        event.availability.availabilityType = AvailabilityType.ScheduledAccess;
        event.availability.periodicityType = periodicity;
        event.availability.timeFrom = { hours: 12, minutes: 10 };
        event.availability.timeTo = { hours: 9, minutes: 30 };

        const result = evaluator.evaluate(event);

        const expected = new Date(mockNow);

        expected.setHours(9);
        expected.setMinutes(30);
        expected.setSeconds(0, 0);

        expect(result).toEqual(expected);
      });
    });

    periodicityTypes.forEach(periodicity => {
      it(`Should return date (now with set timeTo) when periodicity is ${periodicity} and now is start of day`, () => {
        const mockNow = new Date(2023, 5, 7, 0, 0, 0, 0);

        const evaluator = new AvailableToEvaluator({
          isSpreadToNextDay: () => true,
        });

        //@ts-expect-error
        evaluator.getNow = jest.fn().mockReturnValue(mockNow);

        const event = getEmptyEvent();
        event.availability.availabilityType = AvailabilityType.ScheduledAccess;
        event.availability.periodicityType = periodicity;
        event.availability.timeFrom = { hours: 12, minutes: 10 };
        event.availability.timeTo = { hours: 9, minutes: 30 };

        const result = evaluator.evaluate(event);

        const expected = new Date(mockNow);

        expected.setHours(9);
        expected.setMinutes(30);
        expected.setSeconds(0, 0);

        expect(result).toEqual(expected);
      });
    });

    periodicityTypes.forEach(periodicity => {
      it(`Should return date (now + 1 day) with set timeTo when periodicity is ${periodicity} and now is end of day`, () => {
        const mockNow = new Date(2023, 5, 7, 23, 59, 59);

        const evaluator = new AvailableToEvaluator({
          isSpreadToNextDay: () => true,
        });

        //@ts-expect-error
        evaluator.getNow = jest.fn().mockReturnValue(mockNow);

        const event = getEmptyEvent();
        event.availability.availabilityType = AvailabilityType.ScheduledAccess;
        event.availability.periodicityType = periodicity;
        event.availability.timeFrom = { hours: 12, minutes: 10 };
        event.availability.timeTo = { hours: 9, minutes: 30 };

        const result = evaluator.evaluate(event);

        const expected = addDays(mockNow, 1);

        expected.setHours(9);
        expected.setMinutes(30);
        expected.setSeconds(0, 0);

        expect(result).toEqual(expected);
      });
    });
  });
});

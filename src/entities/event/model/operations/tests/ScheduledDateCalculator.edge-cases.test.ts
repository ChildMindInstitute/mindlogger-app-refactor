import { AvailabilityType, PeriodicityType } from '@app/abstract/lib';

import {
  EventAvailability,
  ScheduleEvent,
} from '../../../lib/types/scheduledDateCalculator';
import { ScheduledDateCalculator } from '../ScheduledDateCalculator';

const createEvent = () => {
  const eventAvailability: EventAvailability = {
    availabilityType: AvailabilityType.AlwaysAvailable,
    periodicityType: PeriodicityType.Always,
    timeFrom: null,
    timeTo: null,
    startDate: null,
    endDate: null,
  };

  const scheduleEvent: ScheduleEvent = {
    id: 'eventTestId',
    entityId: 'entityTestId',
    availability: eventAvailability,
    selectedDate: null,
    scheduledAt: null,
  };

  return scheduleEvent;
};

describe('Test ScheduledDateCalculator: edge cases and cache', () => {
  it('Should take value from cache when call calculate 2nd time with the same event settings', () => {
    const calculator = new ScheduledDateCalculator();

    const mockDate = new Date(2023, 5, 10);

    const calculateInternalMock = jest.fn().mockReturnValue(mockDate);
    //@ts-expect-error
    calculator.calculateInternal = calculateInternalMock;

    const scheduleEvent = createEvent();

    const result = calculator.calculate(scheduleEvent);

    expect(result).toEqual(mockDate);

    const secondResult = calculator.calculate({ ...scheduleEvent });

    expect(secondResult).toEqual(mockDate);

    expect(calculateInternalMock).toHaveBeenCalledTimes(1);
  });

  it('Should throw error if to pass event with time set in the selectedDate', () => {
    const calculator = new ScheduledDateCalculator();

    const scheduleEvent = createEvent();

    scheduleEvent.selectedDate = new Date(2023, 10, 5, 15, 30);

    expect(() => calculator.calculate(scheduleEvent)).toThrow(
      '[ScheduledDateCalculator]: selectedDate contains time set',
    );
  });
});

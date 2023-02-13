import { Parse, Day, ScheduleInput } from 'dayspan';

import { AvailabilityType, PeriodicityType, ScheduleEvent } from '../../lib';

type EventParseInput = ScheduleInput<any>;

const calculateScheduledAt = (event: ScheduleEvent): Date | null => {
  let { availability, selectedDate } = event;

  let selectedMonth: number | null;
  let selectedDay: number | null;
  let selectedDayOfWeek: number | null;
  let selectedYear: number | null;

  if (selectedDate) {
    selectedYear = selectedDate.getFullYear();
    selectedMonth = selectedDate.getMonth();
    selectedDay = selectedDate.getDate();
    selectedDayOfWeek = selectedDate.getDay();
  }

  let parseInput: EventParseInput = {};

  const alwaysAvailable =
    availability.availabilityType === AvailabilityType.AlwaysAvailable;

  const scheduled =
    availability.availabilityType === AvailabilityType.ScheduledAccess;

  const now = new Date();

  if (
    alwaysAvailable ||
    (scheduled && availability.periodicityType === PeriodicityType.Once)
  ) {
    const result = new Date(selectedYear!, selectedMonth!, selectedDay!);

    if (availability.timeFrom) {
      result.setHours(availability.timeFrom.hours);
      result.setMinutes(availability.timeFrom.minutes);
    }
    return result;
  } else if (
    scheduled &&
    availability.periodicityType === PeriodicityType.Weekly
  ) {
    parseInput.dayOfWeek = [selectedDayOfWeek!];
  } else if (
    scheduled &&
    availability.periodicityType === PeriodicityType.Weekdays
  ) {
    parseInput.dayOfWeek = [1, 2, 3, 4, 5];
  } else if (
    scheduled &&
    availability.periodicityType === PeriodicityType.Monthly
  ) {
    parseInput.dayOfMonth = [selectedDay!];
  }

  if (availability.startDate) {
    parseInput.start = availability.startDate.getTime();
  }

  if (availability.endDate) {
    parseInput.end = availability.endDate.getTime();
  }

  if (availability.timeFrom) {
    parseInput.times = [
      availability.timeFrom.minutes === 0
        ? `${availability.timeFrom.hours}`
        : `${availability.timeFrom.hours}:${availability.timeFrom.minutes}`,
    ];
  }

  const parsedSchedule = Parse.schedule(parseInput!);

  const fromDate = Day.fromDate(now);

  const futureSchedule = parsedSchedule.forecast(fromDate!, true, 1, 0, true);

  const result = futureSchedule.first();

  if (!result) {
    return null;
  }

  return result[0].start.date;
};

const cache = new Map();

export const SheduledDateCalculator = {
  calculate: (event: ScheduleEvent): Date | null => {
    const today = new Date().toDateString();

    const key =
      JSON.stringify(event.availability) +
      (event.selectedDate?.getTime() ?? '') +
      today;

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = calculateScheduledAt(event);
    cache.set(key, result);

    console.log('calculateScheduledAt', result?.toString());

    return result;
  },
};

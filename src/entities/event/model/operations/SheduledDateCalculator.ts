import { differenceInMonths, startOfDay, subMonths } from 'date-fns';
import { Parse, Day } from 'dayspan';

import { AvailabilityType, PeriodicityType, ScheduleEvent } from '../../lib';

type EventParseInput = Parameters<typeof Parse.schedule>[0];

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

  const alwaysAvailable =
    availability.availabilityType === AvailabilityType.AlwaysAvailable;

  const scheduled =
    availability.availabilityType === AvailabilityType.ScheduledAccess;

  const now = new Date();

  const setTime = (target: Date) => {
    if (availability.timeFrom) {
      target.setHours(availability.timeFrom.hours);
      target.setMinutes(availability.timeFrom.minutes);
    }
  };

  if (
    alwaysAvailable ||
    (scheduled && availability.periodicityType === PeriodicityType.Once)
  ) {
    const result = new Date(selectedYear!, selectedMonth!, selectedDay!);
    setTime(result);
    return result;
  }

  if (availability.periodicityType === PeriodicityType.Monthly) {
    const today = startOfDay(now);

    let date = new Date(selectedDate!);

    const diff = differenceInMonths(date, today);
    let check = subMonths(date, diff);

    if (check > today) {
      date = subMonths(date, diff + 1);
    } else {
      date = check;
    }
    if (date < availability.startDate! || date > availability.endDate!) {
      return null;
    }
    setTime(date);

    return date;
  }

  let parseInput: EventParseInput = {};

  if (availability.periodicityType === PeriodicityType.Weekly) {
    parseInput.dayOfWeek = [selectedDayOfWeek!];
  } else if (availability.periodicityType === PeriodicityType.Weekdays) {
    parseInput.dayOfWeek = [1, 2, 3, 4, 5];
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

    return result;
  },
};

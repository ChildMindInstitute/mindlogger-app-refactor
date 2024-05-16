import {
  addDays,
  addMonths,
  isEqual,
  startOfDay,
  subDays,
  subMinutes,
  subMonths,
} from 'date-fns';
import { Parse, Day } from 'dayspan';

import { AvailabilityType, PeriodicityType } from '@app/abstract/lib';

import {
  EventAvailability,
  ScheduleEvent,
} from '../../lib/types/scheduledDateCalculator';

type EventParseInput = Parameters<typeof Parse.schedule>[0];

const cache = new Map();

export class ScheduledDateCalculator {
  constructor() {}

  private setTime(target: Date, availability: EventAvailability) {
    if (availability.timeFrom) {
      target.setHours(availability.timeFrom.hours);
      target.setMinutes(availability.timeFrom.minutes);
    }
  }

  private getNow() {
    return new Date();
  }

  private calculateForMonthly(
    selectedDate: Date,
    availability: EventAvailability,
  ): Date | null {
    const today = startOfDay(this.getNow());

    let date = new Date(selectedDate);

    if (selectedDate > today) {
      let months = 0;

      while (date > today) {
        months++;
        date = subMonths(selectedDate, months);
      }
    }

    if (selectedDate < today) {
      let months = 0;

      while (date < today) {
        months++;
        date = addMonths(selectedDate, months);
      }
      if (date > today) {
        date = subMonths(date, 1);
      }
    }

    this.setTime(date, availability);

    return date;
  }

  private calculateForSpecificDay(
    specificDay: Date,
    availability: EventAvailability,
  ): Date | null {
    const yesterday = subDays(startOfDay(this.getNow()), 1);

    if (specificDay < yesterday) {
      return null;
    }

    const selectedYear = specificDay.getFullYear();
    const selectedMonth = specificDay.getMonth();
    const selectedDay = specificDay.getDate();

    const result = new Date(selectedYear, selectedMonth, selectedDay);
    this.setTime(result, availability);
    return result;
  }

  private calculateScheduledAt(event: ScheduleEvent): Date | null {
    const { availability, selectedDate } = event;

    const now = this.getNow();

    if (selectedDate && !isEqual(selectedDate, startOfDay(selectedDate))) {
      throw new Error(
        '[ScheduledDateCalculator]: selectedDate contains time set',
      );
    }

    const alwaysAvailable =
      availability.availabilityType === AvailabilityType.AlwaysAvailable;

    const scheduled =
      availability.availabilityType === AvailabilityType.ScheduledAccess;

    if (alwaysAvailable) {
      return this.calculateForSpecificDay(startOfDay(now), availability);
    }

    if (scheduled && availability.periodicityType === PeriodicityType.Once) {
      return this.calculateForSpecificDay(selectedDate!, availability);
    }

    if (availability.periodicityType === PeriodicityType.Monthly) {
      return this.calculateForMonthly(selectedDate!, availability);
    }

    const parseInput: EventParseInput = {};

    if (availability.periodicityType === PeriodicityType.Weekly) {
      const dayOfWeek = selectedDate!.getDay();
      parseInput.dayOfWeek = [dayOfWeek];
    } else if (availability.periodicityType === PeriodicityType.Weekdays) {
      parseInput.dayOfWeek = [1, 2, 3, 4, 5];
    }

    if (availability.startDate) {
      parseInput.start = availability.startDate.getTime();
    }
    if (availability.endDate) {
      let endOfDay = addDays(availability.endDate, 1);
      endOfDay = subMinutes(endOfDay, 1);
      parseInput.end = endOfDay.getTime();
    }

    const parsedSchedule = Parse.schedule(parseInput);

    const fromDate = Day.fromDate(now);

    const futureSchedule = parsedSchedule.forecast(fromDate!, true, 1, 0, true);

    const calculated = futureSchedule.first();

    if (!calculated) {
      return null;
    }

    const result = calculated[0].start.date;

    this.setTime(result, availability);

    return result;
  }

  public calculate(
    event: ScheduleEvent,
    useCache: boolean = true,
  ): Date | null {
    if (!useCache) {
      return this.calculateScheduledAt(event);
    }

    const today = this.getNow().toDateString();

    const key =
      JSON.stringify(event.availability) +
      (event.selectedDate?.getTime() ?? '') +
      today;

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = this.calculateScheduledAt(event);
    cache.set(key, result);

    return result;
  }
}

export default new ScheduledDateCalculator();

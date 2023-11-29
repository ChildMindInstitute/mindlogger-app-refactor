import { addDays, addMonths, isEqual, subDays, subMonths } from 'date-fns';

import { PeriodicityType, Progress } from '@app/abstract/lib';

import { NotificationBuildMethods } from './NotificationBuildMethods';

export class NotificationDaysExtractor extends NotificationBuildMethods {
  constructor(progress: Progress, appletId: string) {
    super(progress, appletId);
  }

  private getDayFrom(
    firstScheduleDay: Date,
    periodStartDay: Date | null,
  ): Date {
    let dayFrom;
    if (!periodStartDay) {
      dayFrom = firstScheduleDay;
    } else {
      dayFrom =
        periodStartDay > firstScheduleDay ? periodStartDay : firstScheduleDay;
    }
    return dayFrom;
  }

  private getDayTo(lastScheduleDay: Date, periodEndDay: Date | null): Date {
    let dayTo;
    if (!periodEndDay) {
      dayTo = lastScheduleDay;
    } else {
      dayTo = periodEndDay < lastScheduleDay ? periodEndDay : lastScheduleDay;
    }
    return dayTo;
  }

  public extract(
    firstScheduleDay: Date,
    lastScheduleDay: Date,
    periodStartDay: Date | null,
    periodEndDay: Date | null,
    periodicity: PeriodicityType,
    aWeekAgoDay: Date,
    scheduledDay: Date,
  ) {
    const eventDays = [];

    const dayFrom = this.getDayFrom(firstScheduleDay, periodStartDay);

    const dayTo = this.getDayTo(lastScheduleDay, periodEndDay);

    if (periodicity === PeriodicityType.Always) {
      const previousDay = subDays(dayFrom, 1);
      let day = previousDay;

      while (day <= dayTo) {
        eventDays.push(day);
        day = addDays(day, 1);
      }
    }

    if (periodicity === PeriodicityType.Daily) {
      const previousDay = subDays(dayFrom, 1);
      let day = previousDay;

      while (day <= dayTo) {
        eventDays.push(day);
        day = addDays(day, 1);
      }
    }

    if (periodicity === PeriodicityType.Weekly) {
      let day = new Date(scheduledDay);

      while (day <= dayTo) {
        if (day >= aWeekAgoDay) {
          eventDays.push(day);
        }
        day = addDays(day, 7);
      }
    }

    if (periodicity === PeriodicityType.Weekdays) {
      const previousDay = subDays(dayFrom, 1);
      let day = previousDay;

      while (day <= dayTo) {
        const found = this.weekDays.find(x => isEqual(x, day));
        if (found && day >= aWeekAgoDay) {
          eventDays.push(day);
        }
        day = addDays(day, 1);
      }
    }

    if (periodicity === PeriodicityType.Monthly) {
      const monthAgoDay = subMonths(this.currentDay, 1);

      let day = new Date(scheduledDay);

      while (day <= dayTo) {
        if (day >= monthAgoDay) {
          eventDays.push(day);
        }
        day = addMonths(day, 1);
      }
    }

    return eventDays;
  }
}

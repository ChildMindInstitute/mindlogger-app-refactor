import {
  addDays,
  addMonths,
  addWeeks,
  isEqual,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';

import { PeriodicityType, Progress } from '@app/abstract/lib';
import { ILogger, Logger } from '@app/shared/lib';

import { NotificationUtility } from './NotificationUtility';

export class NotificationDaysExtractor {
  private utility: NotificationUtility;

  private logger: ILogger;

  constructor(progress: Progress, appletId: string) {
    this.utility = new NotificationUtility(progress, appletId);
    this.logger = Logger;
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
    eventDayFrom: Date | null,
    eventDayTo: Date | null,
    periodicity: PeriodicityType,
    scheduledDay: Date,
  ): Date[] {
    let eventDays = [];

    const dayFrom = this.getDayFrom(firstScheduleDay, eventDayFrom);

    const dayTo = this.getDayTo(lastScheduleDay, eventDayTo);

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
        if (day >= this.utility.aWeekAgoDay) {
          eventDays.push(day);
        }
        day = addDays(day, 7);
      }
    }

    if (periodicity === PeriodicityType.Weekdays) {
      const previousDay = subDays(dayFrom, 1);
      let day = previousDay;

      while (day <= dayTo) {
        const found = this.utility.weekDays.find(x => isEqual(x, day));
        if (found && day >= this.utility.aWeekAgoDay) {
          eventDays.push(day);
        }
        day = addDays(day, 1);
      }
    }

    if (periodicity === PeriodicityType.Monthly) {
      const monthAgoDay = subMonths(this.utility.currentDay, 1);

      let day = new Date(scheduledDay);

      while (day <= dayTo) {
        if (day >= monthAgoDay) {
          eventDays.push(day);
        }
        day = addMonths(day, 1);
      }
    }

    eventDays = eventDays.filter(day => !eventDayFrom || day >= eventDayFrom);

    return eventDays;
  }

  public extractForReminders(
    lastScheduleDay: Date,
    eventDayFrom: Date | null,
    eventDayTo: Date | null,
    periodicity: PeriodicityType,
    scheduledDay: Date,
  ): Date[] {
    let eventDays: Date[] = [];

    const dayTo = this.getDayTo(lastScheduleDay, eventDayTo);

    let reminderStartDay: Date = scheduledDay;

    if (scheduledDay < subMonths(this.utility.currentDay, 2)) {
      this.logger.warn(
        '[NotificationDaysExtractor.extractForReminders]: scheduledDay is far in the past: ' +
          scheduledDay.toString(),
      );
      return eventDays;
    }

    switch (periodicity) {
      case PeriodicityType.Always:
      case PeriodicityType.Daily:
      case PeriodicityType.Weekdays: {
        reminderStartDay = subDays(scheduledDay, 7);
        break;
      }
      case PeriodicityType.Weekly: {
        reminderStartDay = subWeeks(scheduledDay, 4);
        break;
      }
      case PeriodicityType.Monthly: {
        reminderStartDay = subMonths(scheduledDay, 2);
      }
    }

    if (
      periodicity === PeriodicityType.Always ||
      periodicity === PeriodicityType.Daily
    ) {
      let day = reminderStartDay;

      while (day <= dayTo) {
        eventDays.push(day);
        day = addDays(day, 1);
      }
    }

    if (periodicity === PeriodicityType.Weekly) {
      let day = reminderStartDay;

      while (day <= dayTo) {
        eventDays.push(day);
        day = addWeeks(day, 1);
      }
    }

    if (periodicity === PeriodicityType.Weekdays) {
      let day = reminderStartDay;

      while (day <= dayTo) {
        const found = this.utility.weekDays.find(x => isEqual(x, day));
        if (found && day >= this.utility.aWeekAgoDay) {
          eventDays.push(day);
        }
        day = addDays(day, 1);
      }
    }

    if (periodicity === PeriodicityType.Monthly) {
      let day = reminderStartDay;

      while (day <= dayTo) {
        eventDays.push(day);
        day = addMonths(day, 1);
      }
    }

    eventDays = eventDays.filter(day => !eventDayFrom || day >= eventDayFrom);

    return eventDays;
  }
}

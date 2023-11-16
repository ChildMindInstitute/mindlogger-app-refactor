import { addDays, isEqual, startOfDay, subDays, subSeconds } from 'date-fns';

import {
  AvailabilityType,
  PeriodicityType,
  Progress,
  ProgressPayload,
} from '@app/abstract/lib';
import { ScheduleEvent } from '@app/entities/event';
import {
  DatesFromTo,
  getMsFromHours,
  getMsFromMinutes,
  HourMinute,
  isSourceLess,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
} from '@shared/lib';

import { EventEntity, Activity } from '../../lib';

export type GroupsBuildContext = {
  allAppletActivities: Activity[];
  progress: Progress;
  appletId: string;
};

export class GroupBuildMethods {
  protected progress: Progress;

  protected appletId: string;

  protected activities: Activity[];

  constructor(inputParams: GroupsBuildContext) {
    this.progress = inputParams.progress;
    this.activities = inputParams.allAppletActivities;
    this.appletId = inputParams.appletId;
  }

  protected getNow = () => new Date();

  protected getToday = () => startOfDay(this.getNow());

  protected getYesterday = () => subDays(this.getToday(), 1);

  protected getTomorrow = () => addDays(this.getToday(), 1);

  protected getEndOfDay = () => subSeconds(addDays(this.getToday(), 1), 1);

  protected isToday(date: Date | null | undefined): boolean {
    if (!date) {
      return false;
    }
    return isEqual(this.getToday(), startOfDay(date));
  }

  protected isYesterday(date: Date | null | undefined): boolean {
    if (!date) {
      return false;
    }
    return isEqual(this.getYesterday(), startOfDay(date));
  }

  protected getProgressRecord(
    eventActivity: EventEntity,
  ): ProgressPayload | null {
    const record =
      this.progress[this.appletId]?.[eventActivity.entity.id]?.[
        eventActivity.event.id
      ];
    return record ?? null;
  }

  protected getStartedAt(eventActivity: EventEntity): Date {
    const record = this.getProgressRecord(eventActivity)!;

    return record.startAt!;
  }

  protected getCompletedAt(eventActivity: EventEntity): Date | null {
    const progressRecord = this.getProgressRecord(eventActivity);

    return progressRecord?.endAt ?? null;
  }

  protected isInProgress(eventActivity: EventEntity): boolean {
    const record = this.getProgressRecord(eventActivity);
    if (!record) {
      return false;
    }
    return !!record.startAt && !record.endAt;
  }

  protected isInTimeInterval(
    interval: DatesFromTo,
    valueToCheck: Date | null,
    including: 'from' | 'to' | 'both' | 'none',
  ): boolean {
    if (!valueToCheck) {
      return false;
    }

    switch (including) {
      case 'both':
        return interval.from <= valueToCheck && valueToCheck <= interval.to;
      case 'from':
        return interval.from <= valueToCheck && valueToCheck < interval.to;
      case 'to':
        return interval.from < valueToCheck && valueToCheck <= interval.to;
      case 'none':
        return interval.from < valueToCheck && valueToCheck < interval.to;
    }
  }

  protected getAllowedTimeInterval(
    eventActivity: EventEntity,
    scheduledWhen: 'today' | 'yesterday',
    isAccessBeforeStartTime: boolean = false,
  ): DatesFromTo {
    const { event } = eventActivity;

    const { hours: hoursFrom, minutes: minutesFrom } =
      event.availability.timeFrom!;
    const { hours: hoursTo, minutes: minutesTo } = event.availability.timeTo!;

    if (scheduledWhen === 'today') {
      const allowedFrom = this.getToday();

      if (!isAccessBeforeStartTime) {
        allowedFrom.setHours(hoursFrom);
        allowedFrom.setMinutes(minutesFrom);
      }

      const allowedTo = this.getEndOfDay();

      return { from: allowedFrom, to: allowedTo };
    } else {
      const allowedFrom = this.getYesterday();

      if (!isAccessBeforeStartTime) {
        allowedFrom.setHours(hoursFrom);
        allowedFrom.setMinutes(minutesFrom);
      }

      const allowedTo = this.getToday();
      allowedTo.setHours(hoursTo);
      allowedTo.setMinutes(minutesTo);

      return { from: allowedFrom, to: allowedTo };
    }
  }

  protected getVoidTimeInterval(
    event: ScheduleEvent,
    considerSpread: boolean,
  ): DatesFromTo {
    const buildFrom = considerSpread && this.isSpreadToNextDay(event);

    const { timeFrom, timeTo } = event.availability!;

    let from = this.getToday();

    if (buildFrom) {
      from = this.getToday();
      from.setHours(timeTo!.hours);
      from.setMinutes(timeTo!.minutes);
    }

    const to = this.getToday();
    to.setHours(timeFrom!.hours);
    to.setMinutes(timeFrom!.minutes);

    return { from, to };
  }

  protected isSpreadToNextDay(event: ScheduleEvent): boolean {
    return (
      event.availability.availabilityType ===
        AvailabilityType.ScheduledAccess &&
      isSourceLess({
        timeSource: event.availability.timeTo!,
        timeTarget: event.availability.timeFrom!,
      })
    );
  }

  protected isCompletedInAllowedTimeInterval(
    eventActivity: EventEntity,
    scheduledWhen: 'today' | 'yesterday',
    isAccessBeforeStartTime: boolean = false,
  ): boolean {
    const { from: allowedFrom, to: allowedTo } = this.getAllowedTimeInterval(
      eventActivity,
      scheduledWhen,
      isAccessBeforeStartTime,
    );

    const completedAt = this.getCompletedAt(eventActivity)!;

    if (scheduledWhen === 'today') {
      return allowedFrom <= completedAt && completedAt <= allowedTo;
    } else {
      return allowedFrom <= completedAt && completedAt < allowedTo;
    }
  }

  protected isScheduledYesterday(event: ScheduleEvent): boolean {
    if (
      event.availability.availabilityType === AvailabilityType.AlwaysAvailable
    ) {
      return true;
    }

    const periodicity = event.availability.periodicityType;

    if (periodicity === PeriodicityType.Daily) {
      return true;
    }

    if (periodicity === PeriodicityType.Weekdays) {
      const currentDay = this.getNow().getDay();

      return currentDay >= 2 && currentDay <= 6;
    }

    if (
      periodicity === PeriodicityType.Once ||
      periodicity === PeriodicityType.Weekly ||
      periodicity === PeriodicityType.Monthly
    ) {
      return this.isYesterday(event.scheduledAt);
    }

    return false;
  }

  protected isCompletedToday(eventActivity: EventEntity): boolean {
    const date = this.getCompletedAt(eventActivity);

    return !!date && this.isToday(date);
  }

  protected isInAllowedTimeInterval(
    eventActivity: EventEntity,
    scheduledWhen: 'today' | 'yesterday',
    isAccessBeforeStartTime: boolean = false,
  ): boolean {
    const { from: allowedFrom, to: allowedTo } = this.getAllowedTimeInterval(
      eventActivity,
      scheduledWhen,
      isAccessBeforeStartTime,
    );

    const now = this.getNow();

    if (scheduledWhen === 'today') {
      return allowedFrom <= now && now <= allowedTo;
    } else {
      return allowedFrom <= now && now < allowedTo;
    }
  }

  protected getTimeToComplete(eventActivity: EventEntity): HourMinute | null {
    const { event } = eventActivity;
    const timer = event.timers!.timer!;

    const startedTime = this.getStartedAt(eventActivity);

    const activityDuration: number =
      getMsFromHours(timer.hours) + getMsFromMinutes(timer.minutes);

    const alreadyElapsed: number =
      this.getNow().getTime() - startedTime.getTime();

    if (alreadyElapsed < activityDuration) {
      const left: number = activityDuration - alreadyElapsed;

      const hours = Math.floor(left / MS_IN_MINUTE / MINUTES_IN_HOUR);
      const minutes = Math.floor((left - getMsFromHours(hours)) / MS_IN_MINUTE);

      return { hours, minutes };
    } else {
      return null;
    }
  }
}

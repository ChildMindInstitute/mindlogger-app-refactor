import {
  addDays,
  addYears,
  isEqual,
  startOfDay,
  subDays,
  subSeconds,
  subYears,
} from 'date-fns';

import {
  AvailabilityType,
  EntityProgression,
  EntityProgressionCompleted,
  EntityProgressionInProgress,
  PeriodicityType,
} from '@app/abstract/lib';
import { EventModel, ScheduleEvent } from '@app/entities/event';
import { DatesFromTo, HourMinute, isSourceLess } from '@shared/lib';

const ManyYears = 100;

export class GroupUtility {
  protected appletId: string;

  protected entityProgressions: EntityProgression[];

  constructor(appletId: string, entityProgressions: EntityProgression[]) {
    this.appletId = appletId;
    this.entityProgressions = entityProgressions;
  }

  private getAllowedTimeInterval(
    event: ScheduleEvent,
    scheduledWhen: 'today' | 'yesterday',
    isAccessBeforeStartTime: boolean = false,
  ): DatesFromTo {
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

  public getNow = () => new Date();

  public getToday = () => startOfDay(this.getNow());

  public getYesterday = () => subDays(this.getToday(), 1);

  public getEndOfDay = (date: Date = this.getToday()) =>
    subSeconds(addDays(date, 1), 1);

  public getTomorrow = () => addDays(this.getToday(), 1);

  public isToday(date: Date | null | undefined): boolean {
    if (!date) {
      return false;
    }
    return isEqual(this.getToday(), startOfDay(date));
  }

  public isYesterday(date: Date | null | undefined): boolean {
    if (!date) {
      return false;
    }
    return isEqual(this.getYesterday(), startOfDay(date));
  }

  public getProgressionRecord(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): EntityProgression | null {
    return (
      this.entityProgressions.find(progression => {
        return (
          progression.appletId === this.appletId &&
          progression.entityId === event.entityId &&
          progression.eventId === event.id &&
          progression.targetSubjectId === targetSubjectId
        );
      }) || null
    );
  }

  public getEventCompletedAt(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): Date | null {
    const progressRecord = this.getProgressionRecord(
      event,
      targetSubjectId,
    ) as EntityProgressionCompleted | null;
    return progressRecord?.endedAtTimestamp &&
      progressRecord.endedAtTimestamp > 0
      ? new Date(progressRecord.endedAtTimestamp)
      : null;
  }

  public isEventInProgress(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): boolean {
    const record = this.getProgressionRecord(event, targetSubjectId);
    if (!record) {
      return false;
    }
    return record.status === 'in-progress';
  }

  public isInInterval(
    interval: Partial<DatesFromTo>,
    valueToCheck: Date | null,
    including: 'from' | 'to' | 'both' | 'none',
  ): boolean {
    if (!valueToCheck) {
      return false;
    }

    const deepPast = subYears(this.getToday(), ManyYears);
    const deepFuture = addYears(this.getToday(), ManyYears);

    const from = interval.from ?? deepPast;
    const to = interval.to ?? deepFuture;

    switch (including) {
      case 'both':
        return from <= valueToCheck && valueToCheck <= to;
      case 'from':
        return from <= valueToCheck && valueToCheck < to;
      case 'to':
        return from < valueToCheck && valueToCheck <= to;
      case 'none':
        return from < valueToCheck && valueToCheck < to;
    }
  }

  public getVoidInterval(
    event: ScheduleEvent,
    considerSpread: boolean,
  ): DatesFromTo {
    const buildFrom = considerSpread && this.isSpreadToNextDay(event);

    const { timeFrom, timeTo } = event.availability;

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

  public static isSpreadToNextDay(event: ScheduleEvent): boolean {
    return (
      event.availability.availabilityType ===
        AvailabilityType.ScheduledAccess &&
      isSourceLess({
        timeSource: event.availability.timeTo!,
        timeTarget: event.availability.timeFrom!,
      })
    );
  }

  public isSpreadToNextDay(event: ScheduleEvent): boolean {
    return GroupUtility.isSpreadToNextDay(event);
  }

  public isInsideValidDatesInterval(event: ScheduleEvent) {
    const { startDate, endDate } = event.availability;

    const now = this.getNow();

    return this.isInInterval(
      {
        from: startDate ?? undefined,
        to: endDate ? this.getEndOfDay(endDate) : undefined,
      },
      now,
      'both',
    );
  }

  public isEventCompletedInAllowedTimeInterval(
    event: ScheduleEvent,
    scheduledWhen: 'today' | 'yesterday',
    isAccessBeforeStartTime: boolean,
    targetSubjectId: string | null,
  ): boolean {
    const { from: allowedFrom, to: allowedTo } = this.getAllowedTimeInterval(
      event,
      scheduledWhen,
      isAccessBeforeStartTime,
    );

    const completedAt = this.getEventCompletedAt(event, targetSubjectId);
    if (!completedAt) {
      return false;
    }

    if (scheduledWhen === 'today') {
      return allowedFrom <= completedAt && completedAt <= allowedTo;
    } else {
      return allowedFrom <= completedAt && completedAt < allowedTo;
    }
  }

  public isScheduledYesterday(event: ScheduleEvent): boolean {
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

  public isEventCompletedToday(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): boolean {
    const date = this.getEventCompletedAt(event, targetSubjectId);

    return !!date && this.isToday(date);
  }

  public isInAllowedTimeInterval(
    event: ScheduleEvent,
    scheduledWhen: 'today' | 'yesterday',
    isAccessBeforeStartTime: boolean = false,
  ): boolean {
    const { from: allowedFrom, to: allowedTo } = this.getAllowedTimeInterval(
      event,
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

  public getEventTimeToComplete(
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): HourMinute | null {
    if (!event.timers.timer) {
      throw new Error(
        '[GroupUtility.getTimeToComplete] Timer is not specified',
      );
    }

    const progression = this.getProgressionRecord(
      event,
      targetSubjectId,
    ) as EntityProgressionInProgress | null;

    return EventModel.getTimeToComplete(
      event.timers.timer,
      new Date(progression!.startedAtTimestamp),
      this.getNow(),
    );
  }
}

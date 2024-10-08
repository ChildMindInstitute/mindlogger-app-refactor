import {
  addDays,
  addMilliseconds,
  isEqual,
  startOfDay,
  subDays,
  subSeconds,
  subWeeks,
} from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import {
  EntityProgression,
  EntityProgressionCompleted,
} from '@app/abstract/lib/types/entityProgress';
import {
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { DatesFromTo, HourMinute } from '@app/shared/lib/types/dateTime';
import {
  getDiff,
  getMsFromHours,
  isSourceLess,
  isSourceBiggerOrEqual,
  isSourceBigger,
} from '@app/shared/lib/utils/dateTime';

import {
  FallType,
  InactiveReason,
  NotificationDescriber,
  NotificationSetting,
  NotificationType,
  RandomCrossBorderType,
  ReminderSetting,
  ScheduleEvent,
} from '../../lib/types/notificationBuilder';

export const NumberOfDaysForSchedule = 14;

export const DaysInWeek = 7;

export class NotificationUtility {
  private _weekDays: Date[] | null;

  private progressions: EntityProgression[];

  constructor(appletId: string, progressions: EntityProgression[]) {
    this.now = new Date();
    this._weekDays = null;
    this.appletId = appletId;
    this.progressions = progressions;
  }

  protected appletId: string;

  protected now: Date;

  protected getEndOfDay(date: Date): Date {
    return subSeconds(addDays(startOfDay(date), 1), 1);
  }

  protected getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  protected getProgressionRecord(
    entityId: string,
    eventId: string,
    targetSubjectId: string | null,
  ): EntityProgression | null {
    return (
      this.progressions.find(progression => {
        return (
          progression.appletId === this.appletId &&
          progression.entityId === entityId &&
          progression.eventId === eventId &&
          progression.targetSubjectId === targetSubjectId
        );
      }) || null
    );
  }

  protected getProgressionCompletedAt(
    entityId: string,
    eventId: string,
    targetSubjectId: string | null,
  ): Date | null {
    const progression = this.getProgressionRecord(
      entityId,
      eventId,
      targetSubjectId,
    );

    const completedProgression =
      progression as EntityProgressionCompleted | null;
    if (completedProgression?.endedAtTimestamp) {
      return new Date(completedProgression.endedAtTimestamp);
    } else {
      return null;
    }
  }

  public get currentDay(): Date {
    return startOfDay(this.now);
  }

  public get yesterday(): Date {
    return subDays(this.currentDay, 1);
  }

  public get aWeekAgoDay() {
    return subDays(this.currentDay, 7);
  }

  public get lastScheduleDay() {
    return addDays(this.currentDay, NumberOfDaysForSchedule - 1);
  }

  public get weekDays(): Date[] {
    if (this._weekDays) {
      return this._weekDays;
    }

    const aWeekAgoDay = subWeeks(this.currentDay, 1);

    const result: Date[] = [];

    for (let i = 0; i < NumberOfDaysForSchedule + DaysInWeek; i++) {
      const current = addDays(aWeekAgoDay, i);
      const weekDay = current.getDay();
      if (weekDay >= 1 && weekDay <= 5) {
        result.push(current);
      }
    }
    this._weekDays = result;

    return this._weekDays;
  }

  public isReminderSet(reminder: ReminderSetting | null): boolean {
    return (
      !!reminder &&
      (reminder.activityIncomplete > 0 ||
        reminder.reminderTime.hours > 0 ||
        reminder.reminderTime.minutes > 0)
    );
  }

  public generateEventName(
    entityName: string,
    periodicity: PeriodicityType,
    notifications: NotificationSetting[],
    reminder: ReminderSetting | null,
  ) {
    const isReminderSet = this.isReminderSet(reminder);

    const result = `For ${entityName}, ${periodicity}, ${
      notifications.length
    } notifications, reminder ${isReminderSet ? 'set' : 'unset'}`;
    return result;
  }

  public getFallType(
    triggerAt: Date,
    scheduledDay: Date,
  ): FallType | undefined {
    let fallType: FallType | undefined;

    const triggerDay = startOfDay(triggerAt);

    const tomorrow = addDays(scheduledDay, 1);

    if (isEqual(triggerDay, scheduledDay)) {
      fallType = 'current-day';
    } else if (isEqual(triggerDay, tomorrow)) {
      fallType = 'next-day';
    } else if (triggerDay > tomorrow) {
      fallType = 'in-future';
    }

    return fallType;
  }

  public getTriggerAtForFixed(
    scheduledDay: Date,
    at: HourMinute,
    isNextDay: boolean,
  ): Date {
    let result = new Date(scheduledDay);
    result.setHours(at.hours);
    result.setMinutes(at.minutes);

    if (isNextDay) {
      result = addDays(result, 1);
    }
    return result;
  }

  public getTriggerAtForRandom(
    scheduledDay: Date,
    from: HourMinute,
    to: HourMinute,
    bordersType: RandomCrossBorderType,
  ): Date {
    let result: Date;

    if (
      bordersType === 'both-in-current-day' ||
      bordersType === 'both-in-next-day'
    ) {
      const diff = getDiff(from, to);

      const randomValueToAdd = this.getRandomInt(diff);

      result = new Date(scheduledDay);
      result.setHours(from.hours);
      result.setMinutes(from.minutes);

      result = addMilliseconds(result, randomValueToAdd);

      if (bordersType === 'both-in-next-day') {
        result = addDays(result!, 1);
      }
    }

    if (bordersType === 'from-current-to-next') {
      let diff = getDiff(from, to);

      diff = getMsFromHours(24) + diff;

      const randomValueToAdd = this.getRandomInt(diff);

      result = new Date(scheduledDay);
      result.setHours(from.hours);
      result.setMinutes(from.minutes);

      return addMilliseconds(result, randomValueToAdd);
    }

    return result!;
  }

  public isSpreadToNextDay(event: ScheduleEvent): boolean {
    return (
      event.availability.availabilityType ===
        AvailabilityType.ScheduledAccess &&
      isSourceLess({
        timeSource: event.availability.timeTo!,
        timeTarget: event.availability.timeFrom!,
      })
    );
  }

  public isNextDay(event: ScheduleEvent, timeInSetting: HourMinute) {
    return isSourceLess({
      timeSource: timeInSetting,
      timeTarget: event.availability.timeFrom!,
    });
  }

  public getRandomBorderType(
    event: ScheduleEvent,
    setting: NotificationSetting,
  ): RandomCrossBorderType | null {
    if (
      isSourceLess({
        timeSource: setting.from!,
        timeTarget: event.availability.timeFrom!,
      }) &&
      isSourceLess({
        timeSource: setting.to!,
        timeTarget: event.availability.timeFrom!,
      })
    ) {
      return 'both-in-next-day';
    }

    if (
      isSourceBiggerOrEqual({
        timeSource: setting.from!,
        timeTarget: event.availability.timeFrom!,
      }) &&
      isSourceBigger({
        timeSource: setting.to!,
        timeTarget: event.availability.timeFrom!,
      })
    ) {
      return 'both-in-current-day';
    }

    if (
      isSourceBiggerOrEqual({
        timeSource: setting.from!,
        timeTarget: event.availability.timeFrom!,
      }) &&
      isSourceLess({
        timeSource: setting.to!,
        timeTarget: event.availability.timeFrom!,
      })
    ) {
      return 'from-current-to-next';
    }

    return null;
  }

  public getAvailabilityInterval(
    eventDay: Date,
    event: ScheduleEvent,
  ): DatesFromTo {
    if (
      event.availability.availabilityType === AvailabilityType.AlwaysAvailable
    ) {
      return { from: new Date(eventDay), to: this.getEndOfDay(eventDay) };
    }

    const isSpread = this.isSpreadToNextDay(event);

    const isAccessBeforeTimeFrom = event.availability.allowAccessBeforeFromTime;

    const { timeFrom, timeTo } = event.availability;

    const dateFrom = new Date(eventDay);

    if (!isAccessBeforeTimeFrom) {
      dateFrom.setHours(timeFrom!.hours);
      dateFrom.setMinutes(timeFrom!.minutes);
    }

    let dateTo = new Date(eventDay);

    if (isSpread) {
      dateTo = addDays(dateTo, 1);
    }
    dateTo.setHours(timeTo!.hours);
    dateTo.setMinutes(timeTo!.minutes);

    return { from: dateFrom, to: dateTo };
  }

  public markNotificationIfActivityCompleted(
    entityId: string,
    eventId: string,
    targetSubjectId: string | null,
    notification: NotificationDescriber,
    currentInterval: DatesFromTo,
  ) {
    const completedAt = this.getProgressionCompletedAt(
      entityId,
      eventId,
      targetSubjectId,
    );
    if (!completedAt) {
      return;
    }

    if (
      currentInterval.from <= completedAt &&
      completedAt < currentInterval.to
    ) {
      notification.isActive = false;
      notification.inactiveReason = InactiveReason.ActivityCompleted;
    }
  }

  public markIfNotificationOutdated(
    notification: NotificationDescriber,
    event: ScheduleEvent,
  ) {
    if (notification.scheduledAt < this.now.valueOf()) {
      notification.isActive = false;
      notification.inactiveReason = InactiveReason.Outdated;
    }

    if (
      !!event.availability.startDate &&
      notification.scheduledAt < event.availability.startDate.valueOf()
    ) {
      notification.isActive = false;
      notification.inactiveReason = InactiveReason.OutdatedByStartTime;
    }
  }

  public markIfIsOutOfStartEndDatesRange(
    notification: NotificationDescriber,
    event: ScheduleEvent,
  ) {
    const startDate = event.availability.startDate;
    const endDate = event.availability.endDate;

    if (!startDate || !endDate) {
      return;
    }

    const notificationDay = startOfDay(notification.scheduledAt);

    if (notificationDay < startDate || notificationDay > endDate) {
      notification.isActive = false;
      notification.inactiveReason = InactiveReason.OutOfStartEndDay;
    }
  }

  private getNotificationIds = () => {
    const id = uuidv4();
    const shortId = `${id.slice(0, 2)}_${id.slice(-3)}`;
    return { id, shortId };
  };

  public createNotification(
    triggerAt: Date,
    name: string,
    description: string,
    activityId: string | null,
    activityFlowId: string | null,
    eventId: string,
    targetSubjectId: string | null,
    type: NotificationType,
  ): NotificationDescriber {
    const { id, shortId } = this.getNotificationIds();

    const notification: NotificationDescriber = {
      notificationId: id,
      shortId,
      appletId: this.appletId,
      activityId,
      activityFlowId,
      entityName: name,
      eventId,
      targetSubjectId,
      type: type,
      notificationHeader: name,
      notificationBody: description,
      scheduledAt: triggerAt.valueOf(),
      scheduledAtString: triggerAt.toString(),
      isActive: true,
    };

    return notification;
  }

  public isCompleted(
    entityId: string,
    eventId: string,
    targetSubjectId: string | null,
  ) {
    return !!this.getProgressionCompletedAt(entityId, eventId, targetSubjectId);
  }
}

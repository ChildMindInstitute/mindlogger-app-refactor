import {
  addDays,
  addMilliseconds,
  addMonths,
  isEqual,
  startOfDay,
  subDays,
  subMonths,
  subSeconds,
  subWeeks,
} from 'date-fns';
import i18next from 'i18next';
import { v4 as uuidv4 } from 'uuid';

import {
  ActivityPipelineType,
  Progress,
  NotificationTriggerType,
  PeriodicityType,
  ProgressPayload,
  AvailabilityType,
} from '@app/abstract/lib';
import {
  DatesFromTo,
  getDiff,
  getMsFromHours,
  HourMinute,
  isSourceLess,
} from '@app/shared/lib';

import {
  AppletNotificationDescribers,
  Entity,
  EventEntity,
  NotificationSetting,
  EventNotificationDescribers,
  InactiveReason,
  NotificationBuilderInput,
  NotificationDescriber,
  NotificationType,
  ReminderSetting,
  ScheduleEvent,
} from '../../lib/types';

const NumberOfDaysForSchedule = 14;
const DaysInWeek = 7;

type ReminderSettings = {
  setting: ReminderSetting | null;
  validateWeekends: boolean;
};

interface INotificationBuilder {
  build: () => AppletNotificationDescribers;
}

class NotificationBuilder implements INotificationBuilder {
  private now: Date;

  private progress: Progress;

  private appletId: string;

  private appletName: string;

  private eventEntities: EventEntity[];

  private _weekDays: Date[] | null;

  private keepDebugData: boolean;

  constructor(inputData: NotificationBuilderInput) {
    this.now = new Date();
    this.progress = inputData.progress;
    this.appletId = inputData.appletId;
    this.appletName = inputData.appletName;
    this.eventEntities = inputData.eventEntities;
    this._weekDays = null;
    this.keepDebugData = false;
  }

  private get currentDay(): Date {
    return startOfDay(this.now);
  }

  private getEndOfDay(date: Date): Date {
    return subSeconds(addDays(startOfDay(date), 1), 1);
  }

  private get weekDays(): Date[] {
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

  private getProgressRecord(
    entityId: string,
    eventId: string,
  ): ProgressPayload | null {
    const record = this.progress[this.appletId]?.[entityId]?.[eventId];
    return record ?? null;
  }

  private isReminderSet(reminder: ReminderSetting | null): boolean {
    return (
      !!reminder &&
      (reminder.activityIncomplete > 0 ||
        reminder.reminderTime.hours > 0 ||
        reminder.reminderTime.minutes > 0)
    );
  }

  private isSpreadToNextDay(event: ScheduleEvent): boolean {
    return (
      event.availability.availabilityType ===
        AvailabilityType.ScheduledAccess &&
      isSourceLess({
        timeSource: event.availability.timeTo!,
        timeTarget: event.availability.timeFrom!,
      })
    );
  }

  private getCurrentTimeInterval(
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

  private generateEventName(
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

  private markIfNotificationOutdated(notification: NotificationDescriber) {
    if (notification.scheduledAt < this.now.valueOf()) {
      notification.isActive = false;
      notification.inactiveReason = InactiveReason.Outdated;
    }
  }

  private markIfFallOnWeekend(
    notification: NotificationDescriber,
    isSpread: boolean,
    timeTo: HourMinute,
  ) {
    const day = startOfDay(notification.scheduledAt);

    const isSaturday = day.getDay() === 6;
    const isSunday = day.getDay() === 0;

    if (isSunday || (isSaturday && !isSpread)) {
      notification.isActive = false;
      notification.inactiveReason = InactiveReason.FallOnWeekends;
    }

    if (isSaturday && isSpread) {
      const availableTo = new Date(day);
      availableTo.setHours(timeTo.hours);
      availableTo.setMinutes(timeTo.minutes);

      if (notification.scheduledAt > availableTo.valueOf()) {
        notification.isActive = false;
        notification.inactiveReason = InactiveReason.FallOnWeekends;
      }
    }
  }

  private markAllAsInactiveDueToEntityHidden(
    notifications: NotificationDescriber[],
  ) {
    for (let notification of notifications) {
      notification.isActive = false;
      notification.inactiveReason = InactiveReason.EntityHidden;
    }
  }

  private getActivityCompleteDateTime(
    entityId: string,
    eventId: string,
  ): Date | null {
    const progress = this.getProgressRecord(entityId, eventId);

    return progress ? progress.endAt : null;
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
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

  private extractDaysFromPeriodicitySettings(
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

  private getNotificationTriggerDateTime(
    scheduledDay: Date,
    from: HourMinute | null,
    to: HourMinute | null,
    at: HourMinute | null,
    triggerType: NotificationTriggerType,
    isSpread: boolean,
    considerSpread: boolean,
  ): Date {
    if (triggerType === NotificationTriggerType.FIXED) {
      let result = new Date(scheduledDay);
      result.setHours(at!.hours);
      result.setMinutes(at!.minutes);

      if (isSpread && considerSpread) {
        result = addDays(result, 1);
      }
      return result;
    }

    let diff = getDiff(from!, to!);

    if (isSpread && considerSpread) {
      diff = getMsFromHours(24) + diff;
    }

    const randomValueToAdd = this.getRandomInt(diff);

    const result = new Date(scheduledDay);
    result.setHours(from!.hours);
    result.setMinutes(from!.minutes);

    return addMilliseconds(result, randomValueToAdd);
  }

  private createNotification(
    triggerAt: Date,
    name: string,
    description: string,
    activityId: string | null,
    activityFlowId: string | null,
    eventId: string,
    type: NotificationType,
  ): NotificationDescriber {
    const id = uuidv4();
    const shortId = `${id.slice(0, 2)}_${id.slice(-3)}`;

    const notification: NotificationDescriber = {
      notificationId: id,
      shortId,
      appletId: this.appletId,
      activityId,
      activityFlowId,
      entityName: name,
      eventId,
      type: type,
      notificationHeader: name,
      notificationBody: description,
      scheduledAt: triggerAt.valueOf(),
      scheduledAtString: triggerAt.toString(),
      isActive: true,
    };

    return notification;
  }

  private createReminder(
    scheduledDay: Date,
    activityId: string | null,
    activityFlowId: string | null,
    entityName: string,
    eventId: string,
    reminderData: ReminderSetting | null,
  ) {
    if (!this.isReminderSet(reminderData)) {
      return null;
    }

    const { reminderTime, activityIncomplete: daysIncomplete } = reminderData!;

    const reminderFireDay = addDays(scheduledDay, daysIncomplete);

    const description = 'Just a kindly reminder to complete the activity';

    const triggerAt = this.getNotificationTriggerDateTime(
      reminderFireDay,
      null,
      null,
      reminderTime,
      NotificationTriggerType.FIXED,
      false,
      false,
    );

    const notification = this.createNotification(
      triggerAt,
      entityName,
      description,
      activityId,
      activityFlowId,
      eventId,
      NotificationType.Reminder,
    );

    return notification;
  }

  private markNotificationIfActivityCompleted(
    activityId: string | null,
    activityFlowId: string | null,
    eventId: string,
    notification: NotificationDescriber,
    currentInterval: DatesFromTo,
  ) {
    const completedAt = this.getActivityCompleteDateTime(
      (activityId ?? activityFlowId)!,
      eventId,
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

  private markNotificationsDueToOneTimeCompletionSetting(
    notifications: NotificationDescriber[],
    entityId: string,
    eventId: string,
    isOneTimeCompletion: boolean,
  ) {
    if (!isOneTimeCompletion) {
      return;
    }
    const completedAt = this.getActivityCompleteDateTime(entityId, eventId);
    if (completedAt) {
      for (let notification of notifications) {
        notification.isActive = false;
        notification.inactiveReason = InactiveReason.OneTimeCompletion;
      }
    }
  }

  private processEventDay(
    day: Date,
    event: ScheduleEvent,
    entity: Entity,
  ): NotificationDescriber[] {
    const activityId: string | null =
      entity.pipelineType === ActivityPipelineType.Regular ? entity.id : null;

    const activityFlowId: string | null =
      entity.pipelineType === ActivityPipelineType.Flow ? entity.id : null;

    const entityName = entity.name;

    const entityDescription = i18next.t(
      'local_notifications:complete_activity',
    );

    const reminderSetting: ReminderSetting | null =
      event.notificationSettings.reminder;

    const reminderSettings: ReminderSettings = {
      setting: reminderSetting,
      validateWeekends:
        event.availability.periodicityType === PeriodicityType.Weekdays,
    };

    const eventNotifications = event.notificationSettings.notifications;

    const result: NotificationDescriber[] = [];

    const currentInterval: DatesFromTo = this.getCurrentTimeInterval(
      day,
      event,
    );

    const isSpread = this.isSpreadToNextDay(event);

    for (let eventNotification of eventNotifications) {
      const { from, to, at, triggerType } = eventNotification;

      const triggerAt = this.getNotificationTriggerDateTime(
        day,
        from,
        to,
        at,
        triggerType,
        isSpread,
        true,
      );

      const notification = this.createNotification(
        triggerAt,
        entityName,
        entityDescription,
        activityId,
        activityFlowId,
        event.id,
        NotificationType.Regular,
      );

      this.markNotificationIfActivityCompleted(
        activityId,
        activityFlowId,
        event.id,
        notification,
        currentInterval,
      );

      this.markIfNotificationOutdated(notification);

      result.push(notification);
    }

    const reminder = this.createReminder(
      day,
      activityId,
      activityFlowId,
      entityName,
      event.id,
      reminderSettings.setting,
    );

    if (reminder?.isActive) {
      this.markNotificationIfActivityCompleted(
        activityId,
        activityFlowId,
        event.id,
        reminder,
        currentInterval,
      );
    }

    if (reminder?.isActive) {
      this.markIfNotificationOutdated(reminder);
    }

    if (reminder?.isActive && reminderSettings.validateWeekends) {
      this.markIfFallOnWeekend(reminder, isSpread, event.availability.timeTo!);
    }

    if (reminder) {
      result.push(reminder);
    }

    return result;
  }

  private processEvent(
    event: ScheduleEvent,
    entity: Entity,
  ): EventNotificationDescribers {
    const eventResult: EventNotificationDescribers = {
      eventId: event.id,
      notifications: [],
      eventName: '',
    };

    if (!event.scheduledAt) {
      return eventResult;
    }

    const scheduledDay = startOfDay(event.scheduledAt);

    const firstScheduleDay = this.currentDay;

    const lastScheduleDay = addDays(
      this.currentDay,
      NumberOfDaysForSchedule - 1,
    );

    const periodStartDay = event.availability.startDate;

    const periodEndDay = event.availability.endDate;

    const periodicity = event.availability.periodicityType;

    const entityName = entity.name;

    const isEntityHidden = !entity.isVisible;

    const eventId = event.id;

    const eventNotifications = event.notificationSettings.notifications;

    const reminderSetting: ReminderSetting | null =
      event.notificationSettings.reminder;

    eventResult.eventName = this.generateEventName(
      entityName,
      periodicity,
      eventNotifications,
      reminderSetting,
    );

    const aWeekAgoDay = addDays(this.currentDay, -7);

    const isPeriodicitySet =
      periodicity === PeriodicityType.Daily ||
      periodicity === PeriodicityType.Weekly ||
      periodicity === PeriodicityType.Weekdays ||
      periodicity === PeriodicityType.Monthly;

    const isOnceEvent = periodicity === PeriodicityType.Once;

    if (isOnceEvent && scheduledDay < aWeekAgoDay) {
      return eventResult;
    }
    if (isPeriodicitySet && periodEndDay && periodEndDay < this.currentDay) {
      return eventResult;
    }
    if (
      isPeriodicitySet &&
      periodStartDay &&
      periodStartDay > lastScheduleDay
    ) {
      return eventResult;
    }

    if (isOnceEvent) {
      const notifications = this.processEventDay(scheduledDay, event, entity);
      this.markNotificationsDueToOneTimeCompletionSetting(
        notifications,
        entity.id,
        eventId,
        event.availability.oneTimeCompletion,
      );
      eventResult.notifications.push(...notifications);
    } else {
      const days = this.extractDaysFromPeriodicitySettings(
        firstScheduleDay,
        lastScheduleDay,
        periodStartDay,
        periodEndDay,
        periodicity,
        aWeekAgoDay,
        scheduledDay,
      );

      for (let day of days) {
        const notifications = this.processEventDay(day, event, entity);
        eventResult.notifications.push(...notifications);
      }
    }

    if (isEntityHidden) {
      this.markAllAsInactiveDueToEntityHidden(eventResult.notifications);
    }

    if (this.keepDebugData) {
      for (let notification of eventResult.notifications) {
        notification.toString_Debug = JSON.stringify(notification, null, 2);
        notification.scheduledEvent_Debug = event;
        notification.scheduledEventString_Debug = JSON.stringify(
          event,
          null,
          2,
        );
      }
    }

    return eventResult;
  }

  // PUBLIC

  public build(): AppletNotificationDescribers {
    const eventNotificationsResult: Array<EventNotificationDescribers> = [];

    for (let eventEntity of this.eventEntities) {
      try {
        const eventNotifications = this.processEvent(
          eventEntity.event,
          eventEntity.entity,
        );
        eventNotificationsResult.push(eventNotifications);
      } catch (error: any) {
        console.error(
          `[NotificationBuilder.build] Error occurred during process event: "${eventEntity.event.id}", entity: "${eventEntity.entity?.name}" :\n\n` +
            error.toString(),
        );
      }
    }

    const result: AppletNotificationDescribers = {
      appletId: this.appletId,
      appletName: this.appletName,
      events: eventNotificationsResult,
    };

    return result;
  }
}

export const createNotificationBuilder = (
  inputData: NotificationBuilderInput,
): INotificationBuilder => {
  return new NotificationBuilder(inputData);
};

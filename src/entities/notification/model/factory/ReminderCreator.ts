import { addDays, addMonths } from 'date-fns';

import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import {
  EntityProgression,
  EntityResponseTime,
} from '@app/abstract/lib/types/entityProgress';
import { PeriodicityType } from '@app/abstract/lib/types/event';
import { DatesFromTo } from '@app/shared/lib/types/dateTime';

import { NotificationUtility } from './NotificationUtility';
import {
  Entity,
  InactiveReason,
  NotificationDescriber,
  NotificationType,
  ScheduleEvent,
} from '../../lib/types/notificationBuilder';

export class ReminderCreator {
  private responseTimes: EntityResponseTime[];

  private utility: NotificationUtility;

  constructor(
    appletId: string,
    progressions: EntityProgression[],
    responseTimes: EntityResponseTime[],
  ) {
    this.responseTimes = responseTimes;

    this.utility = new NotificationUtility(appletId, progressions);
  }

  private isCompletedInInterval(
    interval: DatesFromTo,
    entityId: string,
    eventId: string,
    targetSubjectId: string | null,
  ): boolean {
    const dates = this.responseTimes
      .filter(
        record =>
          record.entityId === entityId &&
          record.eventId === eventId &&
          record.targetSubjectId === targetSubjectId,
      )
      .map(record => record.responseTime);

    return dates
      .map<Date>(x => new Date(x))
      .some(date => interval.from <= date && date <= interval.to);
  }

  private createReminder(
    scheduledDay: Date,
    entity: Entity,
    event: ScheduleEvent,
    targetSubjectId: string | null,
  ): NotificationDescriber {
    const reminderData = event.notificationSettings.reminder;

    const activityId: string | null =
      entity.pipelineType === ActivityPipelineType.Regular ? entity.id : null;

    const activityFlowId: string | null =
      entity.pipelineType === ActivityPipelineType.Flow ? entity.id : null;

    const { reminderTime, activityIncomplete: daysIncomplete } = reminderData!;

    let reminderFireDay =
      event.availability.periodicityType === PeriodicityType.Monthly
        ? addMonths(scheduledDay, daysIncomplete)
        : addDays(scheduledDay, daysIncomplete);

    const isNextDay = this.utility.isNextDay(event, reminderTime);
    if (
      event.availability.periodicityType === PeriodicityType.Monthly &&
      isNextDay
    ) {
      reminderFireDay = addDays(reminderFireDay, 1);
    }

    const description = 'Just a kindly reminder to complete the activity';

    const triggerAt = this.utility.getTriggerAtForFixed(
      reminderFireDay,
      reminderTime,
      false,
    );

    const notification = this.utility.createNotification(
      triggerAt,
      entity.name,
      description,
      activityId,
      activityFlowId,
      event.id,
      targetSubjectId,
      NotificationType.Reminder,
    );

    notification.isSpreadInEventSet = this.utility.isSpreadToNextDay(event);
    notification.fallType = this.utility.getFallType(triggerAt, scheduledDay);
    notification.eventDayString = scheduledDay.toString();

    return notification;
  }

  private collectEventDayIntervals(
    eventDays: Date[],
    event: ScheduleEvent,
  ): DatesFromTo[] {
    return eventDays.map(day =>
      this.utility.getAvailabilityInterval(day, event),
    );
  }

  private markIfCompletionExist(
    reminder: NotificationDescriber,
    periodFrom: Date,
  ) {
    const periodTo = new Date(reminder.scheduledAt);

    const isCompleted = this.isCompletedInInterval(
      { from: periodFrom, to: periodTo },
      (reminder.activityId ?? reminder.activityFlowId)!,
      reminder.eventId,
      reminder.targetSubjectId,
    );

    if (isCompleted) {
      reminder.isActive = false;
      reminder.inactiveReason = InactiveReason.ActivityCompleted;
    }
  }

  private markIfFallOnUnavailablePeriod(
    reminder: NotificationDescriber,
    availabilityIntervals: DatesFromTo[],
  ) {
    const date = new Date(reminder.scheduledAt);

    const fallsOnAvailablePeriod = availabilityIntervals.some(
      x => x.from <= date && date <= x.to,
    );

    if (!fallsOnAvailablePeriod) {
      reminder.isActive = false;
      reminder.inactiveReason = InactiveReason.FallOnInvalidPeriod;
    }
  }

  public create(
    eventDays: Date[],
    reminderDays: Date[],
    event: ScheduleEvent,
    entity: Entity,
    targetSubjectId: string | null,
  ): Array<{ reminder: NotificationDescriber; eventDay: Date }> {
    if (!this.utility.isReminderSet(event.notificationSettings.reminder)) {
      return [];
    }

    const result = [];

    const availabilityIntervals = this.collectEventDayIntervals(
      eventDays,
      event,
    );

    for (const day of reminderDays) {
      const reminder: NotificationDescriber = this.createReminder(
        day,
        entity,
        event,
        targetSubjectId,
      );
      result.push({ reminder, eventDay: day });

      const interval = this.utility.getAvailabilityInterval(day, event);

      if (reminder?.isActive) {
        this.markIfFallOnUnavailablePeriod(reminder, availabilityIntervals);
      }

      if (reminder?.isActive) {
        this.markIfCompletionExist(reminder, interval.from);
      }

      if (reminder?.isActive) {
        this.utility.markIfNotificationOutdated(reminder, event);
      }

      if (reminder?.isActive) {
        this.utility.markIfIsOutOfStartEndDatesRange(reminder, event);
      }
    }

    return result;
  }
}

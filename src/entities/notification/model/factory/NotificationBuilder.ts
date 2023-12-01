import { addDays, isEqual, startOfDay } from 'date-fns';
import i18next from 'i18next';

import {
  ActivityPipelineType,
  NotificationTriggerType,
  PeriodicityType,
} from '@app/abstract/lib';
import { DatesFromTo, Logger } from '@app/shared/lib';

import { NotificationBuildMethods } from './NotificationBuildMethods';
import { NotificationDaysExtractor } from './NotificationDaysExtractor';
import { ReminderCreator } from './ReminderCreator';
import {
  AppletNotificationDescribers,
  Entity,
  EventEntity,
  EventNotificationDescribers,
  NotificationBuilderInput,
  NotificationDescriber,
  NotificationType,
  RandomCrossBorderType,
  ReminderSetting,
  ScheduleEvent,
} from '../../lib/types';

const NumberOfDaysForSchedule = 14;

interface INotificationBuilder {
  build: () => AppletNotificationDescribers;
}

class NotificationBuilder
  extends NotificationBuildMethods
  implements INotificationBuilder
{
  private appletName: string;

  private eventEntities: EventEntity[];

  private keepDebugData: boolean;

  private notificationDaysExtractor: NotificationDaysExtractor;

  private reminderCreator: ReminderCreator;

  constructor(inputData: NotificationBuilderInput) {
    super(inputData.progress, inputData.appletId);

    this.appletName = inputData.appletName;
    this.eventEntities = inputData.eventEntities;

    this.keepDebugData = false;

    this.notificationDaysExtractor = new NotificationDaysExtractor(
      inputData.progress,
      inputData.appletId,
    );
    this.reminderCreator = new ReminderCreator(
      inputData.progress,
      inputData.appletId,
      inputData.completions,
    );
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

    const eventNotifications = event.notificationSettings.notifications;

    const result: NotificationDescriber[] = [];

    const currentInterval: DatesFromTo = this.getAvailabilityInterval(
      day,
      event,
    );

    const isSpread = this.isSpreadToNextDay(event);

    for (let eventNotification of eventNotifications) {
      const { from, to, at, triggerType } = eventNotification;

      let triggerAt: Date;
      let randomBorderType: RandomCrossBorderType | null | undefined;

      if (triggerType === NotificationTriggerType.FIXED) {
        const isNextDay =
          isSpread && this.isNextDay(event, eventNotification.at!);

        triggerAt = this.getTriggerAtForFixed(day, at!, isNextDay);
      }

      if (triggerType === NotificationTriggerType.RANDOM) {
        randomBorderType = !isSpread
          ? 'both-in-current-day'
          : this.getRandomBorderType(event, eventNotification)!;

        triggerAt = this.getTriggerAtForRandom(
          day,
          from!,
          to!,
          randomBorderType!,
        );

        if (!triggerAt) {
          Logger.warn(
            '[NotificationBuilder.processEventDay]: triggerAt is not defined for random notification',
          );
          continue;
        }
      }

      const notification: NotificationDescriber = this.createNotification(
        triggerAt!,
        entityName,
        entityDescription,
        activityId,
        activityFlowId,
        event.id,
        NotificationType.Regular,
      );

      notification.fallType = this.getFallType(triggerAt!, day);
      notification.isSpreadInEventSet = isSpread;
      notification.randomDayCrossType = randomBorderType;

      this.markNotificationIfActivityCompleted(
        (activityId ?? activityFlowId)!,
        event.id,
        notification,
        currentInterval,
      );

      this.markIfNotificationOutdated(notification, event);

      result.push(notification);
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

      const reminders = this.reminderCreator.create(
        [scheduledDay],
        event,
        entity,
      );
      if (reminders.length) {
        eventResult.notifications.push(reminders[0].reminder);
      }
    } else {
      const days = this.notificationDaysExtractor.extract(
        firstScheduleDay,
        lastScheduleDay,
        periodStartDay,
        periodEndDay,
        periodicity,
        aWeekAgoDay,
        scheduledDay,
      );

      const reminders = this.reminderCreator.create(days, event, entity);

      for (let day of days) {
        const notifications = this.processEventDay(day, event, entity);
        eventResult.notifications.push(...notifications);

        const currentReminder = reminders.find(x => isEqual(x.eventDay, day));

        if (currentReminder) {
          eventResult.notifications.push(currentReminder.reminder);
        }
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

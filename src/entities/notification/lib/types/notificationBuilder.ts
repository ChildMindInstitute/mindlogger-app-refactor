import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import {
  EntityProgression,
  EntityResponseTime,
} from '@app/abstract/lib/types/entityProgress';
import {
  AvailabilityType,
  NotificationTriggerType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import { HourMinute } from '@app/shared/lib/types/dateTime';

export type ReminderSetting = {
  activityIncomplete: number;
  reminderTime: HourMinute;
};

export type NotificationsSection = {
  notifications: NotificationSetting[];
  reminder: ReminderSetting | null;
};

export type NotificationSetting = {
  triggerType: NotificationTriggerType;
  from: HourMinute | null;
  to: HourMinute | null;
  at: HourMinute | null;
};

export type EventAvailability = {
  availabilityType: AvailabilityType;
  oneTimeCompletion: boolean;
  allowAccessBeforeFromTime: boolean;
  periodicityType: PeriodicityType;
  timeFrom: HourMinute | null;
  timeTo: HourMinute | null;
  startDate: Date | null;
  endDate: Date | null;
};

export type ScheduleEvent = {
  id: string;
  entityId: string;
  availability: EventAvailability;
  notificationSettings: NotificationsSection;
  selectedDate: Date | null;
  scheduledAt: Date | null;
};

export type EntityBase = {
  id: string;
  name: string;
  description: string;
  isVisible: boolean;
};

export type Activity = EntityBase & {
  pipelineType: ActivityPipelineType.Regular;
};

export type ActivityFlow = EntityBase & {
  pipelineType: ActivityPipelineType.Flow;
};

export type Entity = Activity | ActivityFlow;

export type EventEntity = {
  entity: Entity;
  event: ScheduleEvent;
  assignment: Assignment | null;
};

export const enum NotificationType {
  NotDefined = 'NotDefined',
  Regular = 'REGULAR',
  Reminder = 'REMINDER',
}

export const enum InactiveReason {
  NotDefined = 'NotDefined',
  Outdated = 'Outdated',
  OutdatedByStartTime = 'OutdatedByStartTime',
  OutOfStartEndDay = 'OutOfStartEndDay',
  ActivityCompleted = 'ActivityCompleted',
  EntityHidden = 'EntityHidden',
  FallOnInvalidPeriod = 'FallOnInvalidPeriod',
}

export const enum BreakReason {
  NotDefined = 'NotDefined',
  ScheduledAtIsEmpty = 'ScheduledAtIsEmpty',
  ScheduledDayIsLessThanYesterday = 'ScheduledDayIsLessThanYesterday',
  EventDayToIsLessThanCurrentDay = 'EventDayToIsLessThanCurrentDay',
  EventDayFromIsMoreThanLastScheduleDay = 'EventDayFromIsMoreThanLastScheduleDay',
  EntityHidden = 'EntityHidden',
  OneTimeCompletion = 'OneTimeCompletion',
}

export type RandomCrossBorderType =
  | 'both-in-current-day'
  | 'from-current-to-next'
  | 'both-in-next-day';

export type FallType = 'current-day' | 'next-day' | 'in-future';

type NotificationDescriberDebugPayload = {
  scheduledEvent_Debug?: ScheduleEvent;
  scheduledEventString_Debug?: string;
  toString_Debug?: string;
};

export type NotificationDescriber = {
  notificationId: string;
  shortId: string;
  appletId: string;
  activityId: string | null;
  activityFlowId: string | null;
  eventId: string;
  targetSubjectId: string | null;
  type: NotificationType;
  entityName: string;
  scheduledAt: number;
  scheduledAtString: string;
  eventDayString?: string;
  notificationHeader: string;
  notificationBody: string;
  isSpreadInEventSet?: boolean;
  fallType?: FallType;
  randomDayCrossType?: RandomCrossBorderType | null;
  isActive: boolean;
  inactiveReason?: InactiveReason;
} & NotificationDescriberDebugPayload;

export type NotificationBuilderInput = {
  appletId: string;
  appletName: string;
  eventEntities: EventEntity[];
  progressions: EntityProgression[];
  responseTimes: EntityResponseTime[];
};

export type EventNotificationDescribers = {
  eventId: string;
  eventName: string;
  scheduleEvent: ScheduleEvent;
  notifications: Array<NotificationDescriber>;
  breakReason?: BreakReason;
};

export type AppletNotificationDescribers = {
  appletId: string;
  appletName: string;
  events: Array<EventNotificationDescribers>;
};

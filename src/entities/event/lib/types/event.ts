import {
  AvailabilityType,
  NotificationTriggerType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { HourMinute } from '@app/shared/lib/types/dateTime';

type NotificationSettings = {
  notifications: EventNotification[];
  reminder?: null | { activityIncomplete: number; reminderTime: HourMinute };
};

export type EventNotification = {
  triggerType: NotificationTriggerType;
  From?: HourMinute | null;
  To?: HourMinute | null;
  At?: HourMinute | null;
};

export type EventAvailability = {
  availabilityType: AvailabilityType;
  oneTimeCompletion: boolean;
  periodicityType: PeriodicityType;
  timeFrom: HourMinute | null;
  timeTo: HourMinute | null;
  allowAccessBeforeFromTime: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

export type ScheduleEvent = {
  id: string;
  entityId: string;
  availability: EventAvailability;
  timers: {
    timer: HourMinute | null;
    idleTimer: HourMinute | null;
  };
  notificationSettings: NotificationSettings;
  selectedDate: Date | null;
  scheduledAt: Date | null;
  version?: string;
};

import { EventId, HourMinute } from '@app/shared/lib';

export const enum AvailabilityType {
  NotDefined = 0,
  AlwaysAvailable = 1,
  ScheduledAccess = 2,
}

export const enum PeriodicityType {
  NotDefined = 0,
  Once = 1,
  Daily = 2,
  Weekly = 3,
  Weekdays = 4,
  Monthly = 5,
}

export type EventAvailability = {
  availabilityType: AvailabilityType;
  oneTimeCompletion: boolean;
  periodicityType: PeriodicityType | null;
  timeFrom: HourMinute | null;
  timeTo: HourMinute | null;
  allowAccessBeforeFromTime: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

export type ScheduleEvent = {
  id: EventId;
  activityId: string;
  availability: EventAvailability;
  scheduledAt: Date | null;
  timers: {
    timer: HourMinute | null;
    idleTimer: HourMinute | null;
  } | null;
  selectedDate: Date | null;
};

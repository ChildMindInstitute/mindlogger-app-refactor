import { HourMinute } from '@app/shared/lib';

export const enum AvailabilityType {
  NotDefined = 'NotDefined',
  AlwaysAvailable = 'AlwaysAvailable',
  ScheduledAccess = 'ScheduledAccess',
}

export const enum PeriodicityType {
  NotDefined = 'NotDefined',
  Always = 'ALWAYS',
  Once = 'ONCE',
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Weekdays = 'WEEKDAYS',
  Monthly = 'MONTHLY',
}

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
  selectedDate: Date | null;
  scheduledAt: Date | null;
};

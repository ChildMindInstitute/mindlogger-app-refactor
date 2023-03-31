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

export const enum NotificationTriggerType {
  NotDefined = 'NotDefined',
  FIXED = 'FIXED',
  RANDOM = 'RANDOM',
}

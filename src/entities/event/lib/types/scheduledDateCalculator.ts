import {
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { HourMinute } from '@app/shared/lib/types/dateTime';

export type EventAvailability = {
  availabilityType: AvailabilityType;
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
  selectedDate: Date | null;
  scheduledAt: Date | null;
};

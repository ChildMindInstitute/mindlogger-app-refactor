import {
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { ScheduleEventDto } from '@app/shared/api/services/IEventsService';
import { buildDateFromDto } from '@app/shared/lib/utils/dateTime';

import { ScheduleEvent } from '../lib/types/event';

export function mapEventsFromDto(
  eventsDto: ScheduleEventDto[],
): ScheduleEvent[] {
  return eventsDto.map<ScheduleEvent>(x => mapEventFromDto(x));
}
export function mapEventFromDto(dto: ScheduleEventDto | null): ScheduleEvent {
  if (!dto) {
    throw new Error('[mapEventFromDto]: dto must be an instance');
  }

  return {
    id: dto.id,
    entityId: dto.entityId,
    selectedDate: buildDateFromDto(dto.selectedDate),
    timers: {
      idleTimer: dto.timers.idleTimer,
      timer: dto.timers.timer,
    },
    scheduledAt: null,
    availability: {
      allowAccessBeforeFromTime: dto.availability.allowAccessBeforeFromTime,
      availabilityType: dto.availabilityType as AvailabilityType,
      periodicityType: dto.availability.periodicityType as PeriodicityType,
      startDate: buildDateFromDto(dto.availability.startDate),
      endDate: buildDateFromDto(dto.availability.endDate),
      oneTimeCompletion: dto.availability.oneTimeCompletion,
      timeFrom: dto.availability.timeFrom,
      timeTo: dto.availability.timeTo,
    },
    notificationSettings: {
      notifications: [],
      reminder: null,
    },
  };
}

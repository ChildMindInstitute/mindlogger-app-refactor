import { AvailabilityType, PeriodicityType } from '@app/abstract/lib';
import { ScheduleEventDto } from '@app/shared/api/services/eventsService';
import { buildDateFromDto } from '@app/shared/lib';

import { ScheduleEvent } from '../lib';

export function mapEventsFromDto(
  eventsDto: ScheduleEventDto[],
): ScheduleEvent[] {
  return eventsDto.map<ScheduleEvent>(x => mapEventFromDto(x));
}
export function mapEventFromDto(dto: ScheduleEventDto): ScheduleEvent {
  return {
    id: dto.id,
    entityId: dto.entityId,
    selectedDate: buildDateFromDto(dto.selectedDate),
    timers: {
      idleTimer: { hours: 0, minutes: 1 }, // dto.timers.idleTimer,
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

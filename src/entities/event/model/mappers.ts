import { ScheduleEventDto } from '@app/shared/api/services/eventsService';
import { buildDateFromDto } from '@app/shared/lib';

import { AvailabilityType, PeriodicityType, ScheduleEvent } from '../lib';

export function mapEventsFromDto(
  eventsDto: ScheduleEventDto[],
): ScheduleEvent[] {
  return eventsDto.map<ScheduleEvent>(x => {
    return {
      id: x.id,
      entityId: x.entityId,
      selectedDate: buildDateFromDto(x.selectedDate),
      timers: {
        idleTimer: x.timers.idleTimer,
        timer: x.timers.timer,
      },
      scheduledAt: null,
      availability: {
        allowAccessBeforeFromTime: x.availability.allowAccessBeforeFromTime,
        availabilityType: x.availabilityType as AvailabilityType,
        periodicityType: x.availability.periodicityType as PeriodicityType,
        startDate: buildDateFromDto(x.availability.startDate),
        endDate: buildDateFromDto(x.availability.endDate),
        oneTimeCompletion: x.availability.oneTimeCompletion,
        timeFrom: x.availability.timeFrom,
        timeTo: x.availability.timeTo,
      },
    };
  });
}

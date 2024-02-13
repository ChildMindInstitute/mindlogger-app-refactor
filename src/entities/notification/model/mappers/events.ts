import { AvailabilityType, PeriodicityType } from '@app/abstract/lib';
import { ScheduleEventDto } from '@app/shared/api';
import { buildDateFromDto } from '@app/shared/lib';

import { ScheduleEvent } from '../../lib';

export function mapEventsFromDto(
  eventsDto: ScheduleEventDto[],
): ScheduleEvent[] {
  return eventsDto.map<ScheduleEvent>((x) => mapEventFromDto(x));
}
export function mapEventFromDto(dto: ScheduleEventDto): ScheduleEvent {
  return {
    id: dto.id,
    entityId: dto.entityId,
    selectedDate: buildDateFromDto(dto.selectedDate),
    scheduledAt: null,
    availability: {
      availabilityType: dto.availabilityType as AvailabilityType,
      periodicityType: dto.availability.periodicityType as PeriodicityType,
      timeFrom: dto.availability.timeFrom,
      timeTo: dto.availability.timeTo,
      startDate: buildDateFromDto(dto.availability.startDate),
      endDate: buildDateFromDto(dto.availability.endDate),
      oneTimeCompletion: dto.availability.oneTimeCompletion,
      allowAccessBeforeFromTime: dto.availability.allowAccessBeforeFromTime,
    },
    notificationSettings: {
      notifications:
        dto.notificationSettings && dto.notificationSettings.notifications
          ? dto.notificationSettings.notifications.map((x) => ({
              at: x.atTime,
              from: x.fromTime,
              to: x.toTime,
              triggerType: x.triggerType,
            }))
          : [],
      reminder: !dto.notificationSettings?.reminder
        ? null
        : {
            activityIncomplete:
              dto.notificationSettings.reminder.activityIncomplete,
            reminderTime: dto.notificationSettings.reminder.reminderTime,
          },
    },
  };
}

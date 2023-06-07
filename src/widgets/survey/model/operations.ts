import {
  ActivityPipelineType,
  AvailabilityType,
  StoreProgressPayload,
} from '@app/abstract/lib';
import { EventModel, ScheduleEvent } from '@app/entities/event';

export const getScheduledDate = (event: ScheduleEvent) => {
  if (
    event.availability.availabilityType !== AvailabilityType.AlwaysAvailable
  ) {
    return EventModel.ScheduledDateCalculator.calculate(event!)!.valueOf();
  }
};

export const getActivityStartAt = (entityEvent: StoreProgressPayload) => {
  return entityEvent.type === ActivityPipelineType.Regular
    ? entityEvent.startAt
    : entityEvent.lastActivityStartAt;
};

import { v4 as uuidv4 } from 'uuid';

import {
  ActivityPipelineType,
  AvailabilityType,
  StoreProgressPayload,
} from '@app/abstract/lib';
import { EventModel, ScheduleEvent } from '@app/entities/event';
import { Answers, PipelineItem } from '@app/features/pass-survey';

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

export const getGroupKey = (entityEvent: StoreProgressPayload) => {
  return entityEvent.type === ActivityPipelineType.Flow
    ? entityEvent.groupKey
    : uuidv4();
};

export const getUserIdentifier = (
  pipeline: PipelineItem[],
  answers: Answers,
) => {
  const itemWithIdentifierStep = pipeline.findIndex(item => {
    return item.type === 'TextInput' && item.payload.shouldIdentifyResponse;
  });

  if (itemWithIdentifierStep > -1) {
    return answers[itemWithIdentifierStep]?.answer as string;
  }
};

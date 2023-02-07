import { ActivityType } from '@app/entities/activity';
import { HourMinute } from '@app/shared/lib';

import { ActivityListGroup } from './activityGroup';

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

export const enum ActivityPipelineType {
  NotDefined = 0,
  Regular,
  Flow,
}

export type AppletId = string;

export type ActivityId = string;

export type ActivityFlowId = string;

export type EntityId = ActivityId | ActivityFlowId;

export type EventId = string;

export type Entity = {
  id: EntityId;
  name: string;
  description: string;
  image: string;
};

export type Activity = Entity & {
  type: ActivityType;
  pipelineType: ActivityPipelineType.Regular;
};

export type ActivityFlow = Entity & {
  hideBadge: boolean;
  items: Array<{ activityId: ActivityId }>;
  pipelineType: ActivityPipelineType.Flow;
};

export type ActivityOrFlow = Activity | ActivityFlow;

export type EventAvailability = {
  availabilityType: AvailabilityType;
  oneTimeCompletion: boolean;
  periodicityType: PeriodicityType;
  timeFrom: HourMinute;
  timeTo: HourMinute;
  allowAccessBeforeFromTime: boolean;
  startDate?: string | null;
  endDate?: string | null;
  selectedDay?: string | null;
};

export type ScheduleEvent = {
  id: EventId;
  activityId: number;
  availability: EventAvailability;
  scheduledAt: Date;
  timers: {
    timer: HourMinute | null;
    idleTimer: HourMinute | null;
  };
};

export type EventActivity = {
  activity: ActivityOrFlow;
  event: ScheduleEvent;
};

export type EventActivityKey = {
  entityId: number;
  eventId: number;
};

export type ActivityFlowProgress = {
  type: ActivityPipelineType.Flow;
  currentActivityId: ActivityId;
};

export type ActivityProgress = {
  type: ActivityPipelineType.Regular;
};

export type ActivityOrFlowProgress = ActivityFlowProgress | ActivityProgress;

export type ProgressPayload = ActivityOrFlowProgress & {
  startAt?: Date;
  endAt?: Date | null;
};

export type EntityProgress = {
  [appletId in AppletId]: {
    [entityId in ActivityId | ActivityFlowId]: {
      [eventId in EventId]?: ProgressPayload;
    };
  };
};

export type ActivityGroupsBuilder = {
  buildInProgress: (
    eventsActivities: Array<EventActivity>,
  ) => ActivityListGroup;
  buildAvailable: (eventsActivities: Array<EventActivity>) => ActivityListGroup;
  buildScheduled: (eventsActivities: Array<EventActivity>) => ActivityListGroup;
};

import { ActivityType } from '@app/entities/activity';
import { ScheduleEvent } from '@app/entities/event';
import {
  ActivityFlowId,
  ActivityId,
  AppletId,
  EntityId,
  EventId,
} from '@app/shared/lib';

import { ActivityListGroup } from './activityGroup';

export const enum ActivityPipelineType {
  NotDefined = 0,
  Regular,
  Flow,
}

export type Entity = {
  id: EntityId;
  name: string;
  description: string;
  image: string | null;
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

export type EventActivity = {
  activity: ActivityOrFlow;
  event: ScheduleEvent;
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
      [eventId in EventId]?: ProgressPayload | null;
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

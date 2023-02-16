import { ActivityType } from '@app/entities/activity';
import { ScheduleEvent } from '@app/entities/event';

export const enum ActivityPipelineType {
  NotDefined = 0,
  Regular,
  Flow,
}

export type Entity = {
  id: string;
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
  items: Array<{ activityId: string }>;
  pipelineType: ActivityPipelineType.Flow;
};

export type ActivityOrFlow = Activity | ActivityFlow;

export type EventActivity = {
  activity: ActivityOrFlow;
  event: ScheduleEvent;
};

export type ActivityFlowProgress = {
  type: ActivityPipelineType.Flow;
  currentActivityId: string;
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
  [appletId in string]: {
    [entityId in string]: {
      [eventId in string]?: ProgressPayload | null;
    };
  };
};

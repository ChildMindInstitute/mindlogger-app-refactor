import { ActivityPipelineType } from '@app/abstract/lib';
import { ActivityType } from '@entities/activity';
import { ScheduleEvent } from '@entities/event';

export type EntityBase = {
  id: string;
  name: string;
  description: string;
  image?: string | null;
};

export type Activity = EntityBase & {
  type: ActivityType;
  isHidden: boolean;
  pipelineType: ActivityPipelineType.Regular;
};

export type ActivityFlow = EntityBase & {
  hideBadge: boolean;
  isHidden: boolean;
  activityIds: Array<string>;
  pipelineType: ActivityPipelineType.Flow;
};

export type Entity = Activity | ActivityFlow;

export type EventEntity = {
  entity: Entity;
  event: ScheduleEvent;
};

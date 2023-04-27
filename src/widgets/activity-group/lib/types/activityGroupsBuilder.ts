import { ActivityPipelineType } from '@app/abstract/lib';
import { ActivityType } from '@entities/activity';
import { ScheduleEvent } from '@entities/event';

export type EntityBase = {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  isHidden: boolean;
  order: number;
};

export type Activity = EntityBase & {
  type: ActivityType;
  pipelineType: ActivityPipelineType.Regular;
};

export type ActivityFlow = EntityBase & {
  hideBadge: boolean;
  activityIds: Array<string>;
  pipelineType: ActivityPipelineType.Flow;
};

export type Entity = Activity | ActivityFlow;

export type EventEntity = {
  entity: Entity;
  event: ScheduleEvent;
};

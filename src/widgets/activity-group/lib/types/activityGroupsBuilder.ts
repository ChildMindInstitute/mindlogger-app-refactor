import { ActivityPipelineType } from '@app/abstract/lib/types';
import { ActivityType } from '@entities/activity';
import { ScheduleEvent } from '@entities/event';

export type Entity = {
  id: string;
  name: string;
  description: string;
  image?: string | null;
};

export type Activity = Entity & {
  type: ActivityType;
  pipelineType: ActivityPipelineType.Regular;
};

export type ActivityFlow = Entity & {
  hideBadge: boolean;
  activityIds: Array<string>;
  pipelineType: ActivityPipelineType.Flow;
};

export type ActivityOrFlow = Activity | ActivityFlow;

export type EventEntity = {
  entity: ActivityOrFlow;
  event: ScheduleEvent;
};

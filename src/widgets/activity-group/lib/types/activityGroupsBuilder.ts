import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import { EntityProgression } from '@app/abstract/lib/types/entityProgress';
import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import { ActivityType } from '@app/entities/activity/lib/types/activityListItem';
import { ScheduleEvent } from '@app/entities/event/lib/types/event';

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
  assignment: Assignment | null;
};

export type GroupsBuildContext = {
  appletId: string;
  allAppletActivities: Activity[];
  entityProgressions: EntityProgression[];
};

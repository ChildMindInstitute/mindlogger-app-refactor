export const enum ActivityPipelineType {
  NotDefined = 0,
  Regular,
  Flow,
}

export type FlowProgress = {
  type: ActivityPipelineType.Flow;
  currentActivityId: string;
};

export type ActivityProgress = {
  type: ActivityPipelineType.Regular;
};

export type EntityProgress = FlowProgress | ActivityProgress;

export type ProgressPayload = EntityProgress & {
  startAt: Date;
  endAt: Date | null;
};

type EventId = string;

type EntityId = string;

type AppletId = string;

type EntityEvents = Record<EventId, ProgressPayload>;

type AppletInProgressEntities = Record<EntityId, EntityEvents>;

export type EntitiesInProgress = Record<AppletId, AppletInProgressEntities>;

export const enum ActivityPipelineType {
  NotDefined = 0,
  Regular,
  Flow,
}

export type FlowProgress = {
  type: ActivityPipelineType.Flow;
  pipelineActivityOrder: number;
  totalActivitiesInPipeline: number;
  currentActivityId: string;
  currentActivityName: string;
  currentActivityDescription: string;
  currentActivityImage: string | null;
  currentActivityStartAt: number | null;
  executionGroupKey: string;
};

export type ActivityProgress = {
  type: ActivityPipelineType.Regular;
};

export type EntityProgress = FlowProgress | ActivityProgress;

export type StoreProgressPayload = EntityProgress & {
  startAt: number;
  endAt: number | null;
};

export interface IStoreProgressPayload {
  type: ActivityPipelineType;
  startAt: number;
  endAt: number | null;
}

type EventId = string;

type EntityId = string;

type AppletId = string;

export type StoreEventsProgress = Record<EventId, StoreProgressPayload>;

export type StoreEntitiesProgress = Record<EntityId, StoreEventsProgress>;

export type StoreProgress = Record<AppletId, StoreEntitiesProgress>;

export type ProgressPayload = EntityProgress & {
  startAt: Date;
  endAt: Date | null;
};

export type CompletedEntities = Record<EntityId, number>;

export type EventCompletions = Record<EventId, number[]>;

export type CompletedEventEntities = Record<EntityId, EventCompletions>;

type EventsProgress = Record<EventId, ProgressPayload>;

type EntitiesProgress = Record<EntityId, EventsProgress>;

export type Progress = Record<AppletId, EntitiesProgress>;

import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';

/** @deprecated */
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

/** @deprecated */
type ActivityProgress = {
  type: ActivityPipelineType.Regular;
};

/** @deprecated */
type EntityProgress = FlowProgress | ActivityProgress;

/** @deprecated */
type StoreProgressPayload = EntityProgress & {
  startAt: number;
  endAt: number | null;
  availableTo: number | null;
};

/** @deprecated */
type EventId = string;

/** @deprecated */
type EntityId = string;

/** @deprecated */
type AppletId = string;

/** @deprecated */
type StoreEventsProgress = Record<EventId, StoreProgressPayload>;

/** @deprecated */
type StoreEntitiesProgress = Record<EntityId, StoreEventsProgress>;

/** @deprecated */
type StoreProgress = Record<AppletId, StoreEntitiesProgress>;

/** @deprecated */
type CompletedEntities = Record<EntityId, number>;

/** @deprecated */
type EventCompletions = Record<EventId, number[]>;

/** @deprecated */
export type CompletedEventEntities = Record<EntityId, EventCompletions>;

export type RootStateFrom = {
  [key: string]: unknown;
  applets: {
    [key: string]: unknown;
    inProgress?: StoreProgress;
    completedEntities?: CompletedEntities;
    completions?: CompletedEventEntities;
  };
};

export type RootStateTo = {
  [key: string]: unknown;
  applets: {
    [key: string]: unknown;
    entityProgressions: unknown;
    entityResponseTimes: unknown;
  };
};

import { ActivityPipelineType } from '@app/abstract/lib';

export type FlowProgressFrom = {
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

type ActivityProgressFrom = {
  type: ActivityPipelineType.Regular;
};

type EntityProgressFrom = FlowProgressFrom | ActivityProgressFrom;

export type StoreProgressPayloadFrom = EntityProgressFrom & {
  startAt: number;
  endAt: number | null;
};

type StoreEventsProgressFrom = Record<string, StoreProgressPayloadFrom>;

type StoreEntitiesProgressFrom = Record<string, StoreEventsProgressFrom>;

type StoreProgressFrom = Record<string, StoreEntitiesProgressFrom>;

export type FlowProgressTo = {
  type: ActivityPipelineType.Flow;
  pipelineActivityOrder: number;
  totalActivitiesInPipeline: number;
  currentActivityId: string;
  currentActivityName: string;
  currentActivityDescription: string;
  currentActivityImage: string | null;
  currentActivityStartAt: number | null;
  executionGroupKey: string;
  entityName: string;
};

type ActivityProgressTo = {
  type: ActivityPipelineType.Regular;
  entityName: string;
};

type EntityProgressTo = FlowProgressTo | ActivityProgressTo;

export type StoreProgressPayloadTo = EntityProgressTo & {
  startAt: number;
  endAt: number | null;
};

type StoreEventsProgressTo = Record<string, StoreProgressPayloadTo>;

type StoreEntitiesProgressTo = Record<string, StoreEventsProgressTo>;

export type StoreProgressTo = Record<string, StoreEntitiesProgressTo>;

export type RootStateFrom = {
  applets: {
    inProgress: StoreProgressFrom;
    completedEntities: any;
    completions: any;
  };
  streaming: any;
  identity: any;
};

export type RootStateTo = {
  applets: {
    inProgress: StoreProgressTo;
    completedEntities: any;
    completions: any;
  };
  streaming: any;
  identity: any;
};

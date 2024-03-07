import { ActivityPipelineType } from '@app/abstract/lib';

// flow records

type FlowPipelineItemFrom = {
  type: 'Stepper' | 'Intermediate' | 'Summary' | 'Finish';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId?: string;
    order: number;
  };
};

type FlowPipelineItemTo = {
  type: 'Stepper' | 'Intermediate' | 'Summary' | 'Finish';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId?: string;
    order: number;
    activityName: string;
    activityDescription?: string;
    activityImage?: string | null;
  };
};

export type FlowStateFrom = {
  step: number;
  pipeline: FlowPipelineItemFrom[];
  isCompletedDueToTimer: boolean;
  context: Record<string, unknown>;
};

export type FlowStateTo = {
  step: number;
  flowName: string | null;
  scheduledDate: number | null;
  pipeline: FlowPipelineItemTo[];
  isCompletedDueToTimer: boolean;
  context: Record<string, unknown>;
};

// redux

export type FlowProgressFrom = {
  type: ActivityPipelineType.Flow;
  currentActivityId: string;
  pipelineActivityOrder: number;
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
};

type ActivityProgressTo = {
  type: ActivityPipelineType.Regular;
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

// input / output

export type MigrationInput = {
  redux: RootStateFrom;
};

export type MigrationOutput = {
  flowStateRecords: Record<string, FlowStateTo>;
  redux: RootStateTo;
};

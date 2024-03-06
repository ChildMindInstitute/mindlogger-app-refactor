import { ActivityPipelineType } from '@app/abstract/lib';

import { Excluded } from '../../types';

// flow records

type FlowPipelineItem0000 = {
  type: 'Stepper' | 'Intermediate' | 'Summary' | 'Finish';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId?: string;
    order: number;
  };
};

type FlowPipelineItem0001 = {
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

export type FlowState0000 = {
  step: number;
  pipeline: FlowPipelineItem0000[];
  isCompletedDueToTimer: boolean;
  context: Record<string, unknown>;
};

export type FlowState0001 = {
  step: number;
  flowName: string | null;
  scheduledDate: number | null;
  pipeline: FlowPipelineItem0001[];
  isCompletedDueToTimer: boolean;
  context: Record<string, unknown>;
};

// redux

type FlowProgress0000 = {
  type: ActivityPipelineType.Flow;
  currentActivityId: string;
  pipelineActivityOrder: number;
  currentActivityStartAt: number | null;
  executionGroupKey: string;
};

type ActivityProgress0000 = {
  type: ActivityPipelineType.Regular;
};

type EntityProgress0000 = FlowProgress0000 | ActivityProgress0000;

type StoreProgressPayload0000 = EntityProgress0000 & {
  startAt: number;
  endAt: number | null;
};

type StoreEventsProgress0000 = Record<string, StoreProgressPayload0000>;

type StoreEntitiesProgress0000 = Record<string, StoreEventsProgress0000>;

type StoreProgress0000 = Record<string, StoreEntitiesProgress0000>;

type FlowProgress0001 = {
  type: ActivityPipelineType.Flow;
  currentActivityId: string;
  pipelineActivityOrder: number;
  currentActivityStartAt: number | null;
  executionGroupKey: string;
};

type ActivityProgress0001 = {
  type: ActivityPipelineType.Regular;
};

type EntityProgress0001 = FlowProgress0001 | ActivityProgress0001;

type StoreProgressPayload0001 = EntityProgress0001 & {
  startAt: number;
  endAt: number | null;
};

type StoreEventsProgress0001 = Record<string, StoreProgressPayload0001>;

type StoreEntitiesProgress0001 = Record<string, StoreEventsProgress0001>;

type StoreProgress0001 = Record<string, StoreEntitiesProgress0001>;

type RootState0000 = {
  applets: {
    inProgress: StoreProgress0000;
    completedEntities: Excluded;
    completions: Excluded;
  };
  streaming: Excluded;
  identity: Excluded;
};

type RootState0001 = {
  applets: {
    inProgress: StoreProgress0001;
    completedEntities: Excluded;
    completions: Excluded;
  };
  streaming: Excluded;
  identity: Excluded;
};

// input / output

export type MigrationInput0000 = {
  redux: RootState0000;
};

export type MigrationOutput0001 = {
  flowStateRecords: Record<string, FlowState0001>;
  redux: RootState0001;
};

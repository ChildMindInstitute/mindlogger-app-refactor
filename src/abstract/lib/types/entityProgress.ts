export type EntityProgressionEntityType = 'activity' | 'activityFlow';

export type EntityProgressionStatus = 'in-progress' | 'completed';

type EntityProgressionBase = {
  status: EntityProgressionStatus;
  appletId: string;
  entityType: EntityProgressionEntityType;
  entityId: string;
  eventId: string | null;
  targetSubjectId: string | null;
};

type EntityProgressionInProgressBase = EntityProgressionBase & {
  status: 'in-progress';
  startedAtTimestamp: number;
  availableUntilTimestamp: number | null;
};

export type EntityProgressionInProgressActivity =
  EntityProgressionInProgressBase & {
    entityType: 'activity';
  };

export type EntityProgressionInProgressActivityFlow =
  EntityProgressionInProgressBase & {
    entityType: 'activityFlow';
    pipelineActivityOrder: number;
    totalActivitiesInPipeline: number;
    currentActivityId: string;
    currentActivityName: string;
    currentActivityDescription: string;
    currentActivityImage: string | null;
    currentActivityStartAt: number | null;
    executionGroupKey: string;
  };

export type EntityProgressionInProgress =
  | EntityProgressionInProgressActivity
  | EntityProgressionInProgressActivityFlow;

export type EntityProgressionCompleted = EntityProgressionBase & {
  status: 'completed';
  endedAtTimestamp: number | null;
};

export type EntityProgression =
  | EntityProgressionInProgress
  | EntityProgressionCompleted;

export type EntityResponseTime = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
  responseTime: number;
};

export type ActivityListItem = {
  id: number;
  name: string;
  description: string;
  image?: string | null;

  isInActivityFlow: boolean;
  activityFlowName?: string | null;
  numberOfActivitiesInFlow?: number | null;
  activityPositionInFlow?: number | null;

  status: ActivityStatus;
  type: ActivityType;

  isTimeoutAccess: boolean; // todo - rename
  isTimeoutAllow: boolean; // todo - rename
  isTimedActivityAllow: boolean; // todo - rename
  hasEventContext: boolean;

  scheduledAt?: string | null;
  availableFrom?: string | null;
  availableTo?: string | null; // specific date or to "Midnight"

  timeToComplete?: { hours: number; minutes: number } | null;
};

export type ActivityListGroup = {
  activities: Array<ActivityListItem>;
  name: string;
  type: ActivityGroupType;
};

export enum ActivityStatus {
  NotDefined = 0,
  InProgress = 1,
  Scheduled = 2,
  PastDue = 3,
}

export enum ActivityGroupType {
  NotDefined = 0,
  InProgress = 1,
  Scheduled = 2,
  Available = 3,
}

export const ActivityGroupTypeNames = {
  [ActivityGroupType.NotDefined]: 'Not Defined',
  [ActivityGroupType.InProgress]: 'additional:in_progress',
  [ActivityGroupType.Scheduled]: 'additional:scheduled',
  [ActivityGroupType.Available]: 'additional:available',
};

export enum ActivityType {
  NotDefined = 0,
  Flanker = 1,
}

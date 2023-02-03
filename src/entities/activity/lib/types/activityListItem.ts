export type ActivityListItem = {
  id: number;
  name: string;
  description: string;
  image?: string | null;

  showActivityFlowBadge: boolean;
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

export const enum ActivityStatus {
  NotDefined = 0,
  InProgress = 1,
  Scheduled = 2,
  PastDue = 3,
}

export const enum ActivityType {
  NotDefined = 0,
  Flanker = 1,
}

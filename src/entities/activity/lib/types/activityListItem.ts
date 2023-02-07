import { HourMinute } from '@app/shared/lib';

export type ActivityListItem = {
  activityId: string;
  eventId: string;

  name: string;
  description: string;
  image?: string | null;

  status: ActivityStatus;
  isAccessBeforeStartTime: boolean;
  type: ActivityType;

  isInActivityFlow: boolean;

  activityFlowDetails?: {
    showActivityFlowBadge: boolean;
    activityFlowName: string;
    numberOfActivitiesInFlow: number;
    activityPositionInFlow: number;
  } | null;

  isTimeIntervalSet: boolean;

  scheduledAt?: string | null;
  availableFrom?: string | null;
  availableTo?: string | null;

  isTimerSet: boolean;
  timeLeftToComplete?: HourMinute | null;
};

export const enum ActivityStatus {
  NotDefined = 0,
  InProgress = 1,
  Scheduled = 2,
  Available = 3,
}

export const enum ActivityType {
  NotDefined = 0,
  Flanker = 1,
}

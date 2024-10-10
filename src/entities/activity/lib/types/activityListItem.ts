import { HourMinute } from '@app/shared/lib/types/dateTime';

export type ActivityListItem = {
  appletId: string;
  activityId: string;
  flowId: string | null;
  eventId: string;
  targetSubjectId: string | null;

  name: string;
  description: string;
  image?: string | null;

  status: ActivityStatus;
  type: ActivityType;

  isInActivityFlow: boolean;

  activityFlowDetails?: {
    showActivityFlowBadge: boolean;
    activityFlowName: string;
    numberOfActivitiesInFlow: number;
    activityPositionInFlow: number;
  } | null;

  availableFrom?: Date | null;
  availableTo?: Date | null;

  isTimerSet: boolean;
  isExpired: boolean;
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

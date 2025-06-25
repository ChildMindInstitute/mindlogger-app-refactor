import { ActivityListItem } from '@app/entities/activity/lib/types/activityListItem';

export const enum ActivityGroupType {
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
} as const;

export type ActivityListGroup = {
  activities: Array<ActivityListItem>;
  name: (typeof ActivityGroupTypeNames)[keyof typeof ActivityGroupTypeNames];
  type: ActivityGroupType;
};

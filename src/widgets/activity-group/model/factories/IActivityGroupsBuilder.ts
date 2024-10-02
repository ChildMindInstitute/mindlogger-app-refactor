import { ActivityListGroup } from '@widgets/activity-group/lib/types/activityGroup.ts';
import { EventEntity } from '@widgets/activity-group/lib/types/activityGroupsBuilder.ts';

export interface IActivityGroupsBuilder {
  buildInProgress: (
    appletId: string,
    eventsActivities: Array<EventEntity>,
  ) => ActivityListGroup;
  buildAvailable: (
    appletId: string,
    eventsActivities: Array<EventEntity>,
  ) => ActivityListGroup;
  buildScheduled: (
    appletId: string,
    eventsActivities: Array<EventEntity>,
  ) => ActivityListGroup;
}

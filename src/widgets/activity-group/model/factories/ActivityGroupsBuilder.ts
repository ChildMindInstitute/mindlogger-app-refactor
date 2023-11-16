import { ActivityListItem } from '@entities/activity';

import { AvailableGroupEvaluator } from './AvailableGroupEvaluator';
import { GroupsBuildContext, GroupBuildMethods } from './GroupBuildMethods';
import { ListItemsFactory } from './ListItemsFactory';
import { ScheduledGroupEvaluator } from './ScheduledGroupEvaluator';
import {
  EventEntity,
  ActivityGroupType,
  ActivityGroupTypeNames,
  ActivityListGroup,
} from '../../lib';

export interface IActivityGroupsBuilder {
  buildInProgress: (eventsActivities: Array<EventEntity>) => ActivityListGroup;
  buildAvailable: (eventsActivities: Array<EventEntity>) => ActivityListGroup;
  buildScheduled: (eventsActivities: Array<EventEntity>) => ActivityListGroup;
}

export class ActivityGroupsBuilder
  extends GroupBuildMethods
  implements IActivityGroupsBuilder
{
  private itemsFactory: ListItemsFactory;

  private scheduledEvaluator: ScheduledGroupEvaluator;

  private availableEvaluator: AvailableGroupEvaluator;

  constructor(inputParams: GroupsBuildContext) {
    super(inputParams);
    this.itemsFactory = new ListItemsFactory(inputParams);
    this.scheduledEvaluator = new ScheduledGroupEvaluator(inputParams);
    this.availableEvaluator = new AvailableGroupEvaluator(inputParams);
  }

  public buildInProgress(
    eventsActivities: Array<EventEntity>,
  ): ActivityListGroup {
    const filtered = eventsActivities.filter(x => this.isInProgress(x));

    const activityItems: Array<ActivityListItem> = [];

    for (let eventActivity of filtered) {
      const item = this.itemsFactory.createProgressItem(eventActivity);

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.InProgress],
      type: ActivityGroupType.InProgress,
    };

    return result;
  }

  public buildAvailable(eventsEntities: Array<EventEntity>): ActivityListGroup {
    const filtered = this.availableEvaluator.evaluate(eventsEntities);

    const activityItems: Array<ActivityListItem> = [];

    for (let eventActivity of filtered) {
      const item = this.itemsFactory.createAvailableItem(eventActivity);

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.Available],
      type: ActivityGroupType.Available,
    };

    return result;
  }

  public buildScheduled(eventsEntities: Array<EventEntity>): ActivityListGroup {
    const filtered = this.scheduledEvaluator.evaluate(eventsEntities);

    const activityItems: Array<ActivityListItem> = [];

    for (let eventActivity of filtered) {
      const item = this.itemsFactory.createScheduledItem(eventActivity);

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.Scheduled],
      type: ActivityGroupType.Scheduled,
    };

    return result;
  }
}

export const createActivityGroupsBuilder = (
  inputData: GroupsBuildContext,
): ActivityGroupsBuilder => {
  return new ActivityGroupsBuilder(inputData);
};

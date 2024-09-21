import { ActivityListItem } from '@entities/activity';

import { AvailableGroupEvaluator } from './AvailableGroupEvaluator';
import { GroupUtility } from './GroupUtility';
import { ListItemsFactory } from './ListItemsFactory';
import { ScheduledGroupEvaluator } from './ScheduledGroupEvaluator';
import {
  EventEntity,
  ActivityGroupType,
  ActivityGroupTypeNames,
  ActivityListGroup,
  GroupsBuildContext,
} from '../../lib';

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

export class ActivityGroupsBuilder implements IActivityGroupsBuilder {
  private itemsFactory: ListItemsFactory;

  private scheduledEvaluator: ScheduledGroupEvaluator;

  private availableEvaluator: AvailableGroupEvaluator;

  private utility: GroupUtility;

  constructor(inputParams: GroupsBuildContext) {
    this.itemsFactory = new ListItemsFactory(inputParams);
    this.scheduledEvaluator = new ScheduledGroupEvaluator(
      inputParams.appletId,
      inputParams.entityProgressions,
    );
    this.availableEvaluator = new AvailableGroupEvaluator(inputParams.appletId);
    this.utility = new GroupUtility(
      inputParams.appletId,
      inputParams.entityProgressions,
    );
  }

  public buildInProgress(
    appletId: string,
    eventsActivities: Array<EventEntity>,
  ): ActivityListGroup {
    const filtered = eventsActivities.filter(x =>
      this.utility.isEventInProgress(x.event, x.assignment?.target.id || null),
    );

    const activityItems: Array<ActivityListItem> = [];

    for (const eventActivity of filtered) {
      const item = this.itemsFactory.createProgressItem(
        appletId,
        eventActivity,
      );

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.InProgress],
      type: ActivityGroupType.InProgress,
    };

    return result;
  }

  public buildAvailable(
    appletId: string,
    eventsEntities: Array<EventEntity>,
  ): ActivityListGroup {
    const inputEntities = eventsEntities.filter(
      x =>
        !this.utility.isEventInProgress(
          x.event,
          x.assignment?.target.id || null,
        ),
    );

    const filtered = this.availableEvaluator.evaluate(inputEntities);

    const activityItems: Array<ActivityListItem> = [];

    for (const eventActivity of filtered) {
      const item = this.itemsFactory.createAvailableItem(
        appletId,
        eventActivity,
      );

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.Available],
      type: ActivityGroupType.Available,
    };

    return result;
  }

  public buildScheduled(
    appletId: string,
    eventsEntities: Array<EventEntity>,
  ): ActivityListGroup {
    const inputEntities = eventsEntities.filter(
      x =>
        !this.utility.isEventInProgress(
          x.event,
          x.assignment?.target.id || null,
        ),
    );

    const filtered = this.scheduledEvaluator.evaluate(inputEntities);

    const activityItems: Array<ActivityListItem> = [];

    for (const eventActivity of filtered) {
      const item = this.itemsFactory.createScheduledItem(
        appletId,
        eventActivity,
      );

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

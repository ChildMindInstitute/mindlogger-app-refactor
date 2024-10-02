import { ActivityListItem } from '@app/entities/activity/lib/types/activityListItem';
import { IActivityGroupsBuilder } from '@widgets/activity-group/model/factories/IActivityGroupsBuilder.ts';

import { AvailableGroupEvaluator } from './AvailableGroupEvaluator';
import { GroupUtility } from './GroupUtility';
import { ListItemsFactory } from './ListItemsFactory';
import { ScheduledGroupEvaluator } from './ScheduledGroupEvaluator';
import {
  ActivityGroupType,
  ActivityGroupTypeNames,
  ActivityListGroup,
} from '../../lib/types/activityGroup';
import {
  EventEntity,
  GroupsBuildContext,
} from '../../lib/types/activityGroupsBuilder';

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
    this.availableEvaluator = new AvailableGroupEvaluator(
      inputParams.appletId,
      inputParams.entityProgressions,
    );
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

import {
  ActivityPipelineType,
  AvailabilityType,
  FlowProgress,
} from '@app/abstract/lib';
import {
  ActivityListItem,
  ActivityStatus,
  ActivityType,
} from '@entities/activity';
import { MIDNIGHT_DATE } from '@shared/lib';

import { GroupUtility, GroupsBuildContext } from './GroupUtility';
import { EventEntity, Activity, ActivityFlow } from '../../lib';

export class ListItemsFactory {
  private utility: GroupUtility;

  constructor(inputParams: GroupsBuildContext) {
    this.utility = new GroupUtility(inputParams);
  }

  private populateActivityFlowFields(
    item: ActivityListItem,
    activityEvent: EventEntity,
  ) {
    const activityFlow = activityEvent.entity as ActivityFlow;

    item.isInActivityFlow = true;
    item.activityFlowDetails = {
      showActivityFlowBadge: !activityFlow.hideBadge,
      activityFlowName: activityFlow.name,
      numberOfActivitiesInFlow: 0,
      activityPositionInFlow: 0,
    };

    const isInProgress = this.utility.isInProgress(activityEvent);

    let activity: Activity;

    if (isInProgress) {
      const progressRecord = this.utility.getProgressRecord(
        activityEvent,
      ) as FlowProgress;

      activity = this.utility.activities.find(
        x => x.id === progressRecord.currentActivityId,
      )!;

      item.activityId = progressRecord.currentActivityId;
      item.name = progressRecord.currentActivityName;
      item.description = progressRecord.currentActivityDescription;
      item.image = progressRecord.currentActivityImage;
      item.activityFlowDetails.activityPositionInFlow =
        progressRecord.pipelineActivityOrder + 1;
      item.activityFlowDetails.numberOfActivitiesInFlow =
        progressRecord.totalActivitiesInPipeline;
    } else {
      activity = this.utility.activities.find(
        x => x.id === activityFlow.activityIds[0],
      )!;

      item.activityId = activity.id;
      item.name = activity.name;
      item.description = activity.description;
      item.image = activity.image;
      item.activityFlowDetails.activityPositionInFlow = 1;
      item.activityFlowDetails.numberOfActivitiesInFlow =
        activityFlow.activityIds.length;
    }
  }

  private createListItem(eventActivity: EventEntity) {
    const { entity, event } = eventActivity;
    const { pipelineType } = eventActivity.entity;
    const isFlow = pipelineType === ActivityPipelineType.Flow;

    const item: ActivityListItem = {
      activityId: isFlow ? '' : entity.id,
      flowId: isFlow ? entity.id : null,
      eventId: event.id,
      name: isFlow ? '' : entity.name,
      description: isFlow ? '' : entity.description,
      type: isFlow ? ActivityType.NotDefined : (entity as Activity).type,
      image: isFlow ? null : entity.image,
      status: ActivityStatus.NotDefined,
      isTimerSet: false,
      isTimerElapsed: false,
      timeLeftToComplete: null,
      isInActivityFlow: false,
    };

    if (isFlow) {
      this.populateActivityFlowFields(item, eventActivity);
    }
    return item;
  }

  public createAvailableItem(eventActivity: EventEntity): ActivityListItem {
    const item = this.createListItem(eventActivity);

    item.status = ActivityStatus.Available;

    const { event } = eventActivity;

    if (
      event.availability.availabilityType === AvailabilityType.ScheduledAccess
    ) {
      const isSpread = this.utility.isSpreadToNextDay(event);

      const to = isSpread
        ? this.utility.getTomorrow()
        : this.utility.getToday();
      to.setHours(event.availability.timeTo!.hours);
      to.setMinutes(event.availability.timeTo!.minutes);
      item.availableTo = to;
    } else {
      item.availableTo = MIDNIGHT_DATE;
    }

    const timeLeftToComplete = event.timers?.timer;
    item.isTimerSet = !!timeLeftToComplete;

    if (item.isTimerSet) {
      item.timeLeftToComplete = timeLeftToComplete;
    }

    return item;
  }

  public createScheduledItem(eventActivity: EventEntity): ActivityListItem {
    const item = this.createListItem(eventActivity);

    item.status = ActivityStatus.Scheduled;

    const { event } = eventActivity;

    const from = this.utility.getNow();
    from.setHours(event.availability.timeFrom!.hours);
    from.setMinutes(event.availability.timeFrom!.minutes);

    const isSpread = this.utility.isSpreadToNextDay(event);

    const to = isSpread ? this.utility.getTomorrow() : this.utility.getToday();
    to.setHours(event.availability.timeTo!.hours);
    to.setMinutes(event.availability.timeTo!.minutes);

    item.availableFrom = from;
    item.availableTo = to;

    return item;
  }

  public createProgressItem(eventActivity: EventEntity): ActivityListItem {
    const item = this.createListItem(eventActivity);

    item.status = ActivityStatus.InProgress;

    const { event } = eventActivity;

    item.isTimerSet = !!event.timers?.timer;

    if (item.isTimerSet) {
      const timeLeft = this.utility.getTimeToComplete(eventActivity);
      item.timeLeftToComplete = timeLeft;

      if (timeLeft === null) {
        item.isTimerElapsed = true;
      }
    }

    return item;
  }
}

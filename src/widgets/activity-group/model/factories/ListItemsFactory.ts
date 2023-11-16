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

import { GroupBuildMethods } from './GroupBuildMethods';
import { EventEntity, Activity, ActivityFlow } from '../../lib';

export class ListItemsFactory extends GroupBuildMethods {
  private populateActivityFlowFields(
    item: ActivityListItem,
    activityEvent: EventEntity,
  ) {
    const activityFlow = activityEvent.entity as ActivityFlow;

    item.isInActivityFlow = true;
    item.activityFlowDetails = {
      showActivityFlowBadge: !activityFlow.hideBadge,
      activityFlowName: activityFlow.name,
      numberOfActivitiesInFlow: activityFlow.activityIds.length,
      activityPositionInFlow: 0,
    };

    const isInProgress = this.isInProgress(activityEvent);

    let activity: Activity, position: number;

    if (isInProgress) {
      const progressRecord = this.getProgressRecord(
        activityEvent,
      ) as FlowProgress;

      activity = this.activities.find(
        x => x.id === progressRecord.currentActivityId,
      )!;
      position = progressRecord.pipelineActivityOrder + 1;
    } else {
      activity = this.activities.find(
        x => x.id === activityFlow.activityIds[0],
      )!;
      position = 1;
    }

    item.activityId = activity.id;
    item.activityFlowDetails.activityPositionInFlow = position;
    item.name = activity.name;
    item.description = activity.description;
    item.type = activity.type;
    item.image = activity.image;
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
      const isSpread = this.isSpreadToNextDay(event);

      const to = isSpread ? this.getTomorrow() : this.getToday();
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

    const from = this.getNow();
    from.setHours(event.availability.timeFrom!.hours);
    from.setMinutes(event.availability.timeFrom!.minutes);

    const isSpread = this.isSpreadToNextDay(event);

    const to = isSpread ? this.getTomorrow() : this.getToday();
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
      const timeLeft = this.getTimeToComplete(eventActivity);
      item.timeLeftToComplete = timeLeft;

      if (timeLeft === null) {
        item.isTimerElapsed = true;
      }
    }

    return item;
  }
}

import {
  ActivityPipelineType,
  AvailabilityType,
  EntityProgressionInProgress,
  EntityProgressionInProgressActivityFlow,
} from '@app/abstract/lib';
import { EventModel } from '@app/entities/event';
import {
  ActivityListItem,
  ActivityStatus,
  ActivityType,
} from '@entities/activity';
import { HourMinute, isEntityExpired, MIDNIGHT_DATE } from '@shared/lib';

import { GroupUtility } from './GroupUtility';
import {
  EventEntity,
  Activity,
  ActivityFlow,
  GroupsBuildContext,
} from '../../lib';

export class ListItemsFactory {
  private utility: GroupUtility;
  private availableToEvaluator: EventModel.AvailableToEvaluator;
  protected activities: Activity[];

  constructor(inputParams: GroupsBuildContext) {
    this.utility = new GroupUtility(
      inputParams.appletId,
      inputParams.entityProgressions,
    );
    this.availableToEvaluator = new EventModel.AvailableToEvaluator(
      this.utility,
    );
    this.activities = inputParams.allAppletActivities;
  }

  private populateActivityFlowFields(
    item: ActivityListItem,
    activityEvent: EventEntity,
  ) {
    const activityFlow = activityEvent.entity as ActivityFlow;
    const { event, assignment } = activityEvent;

    item.isInActivityFlow = true;
    item.activityFlowDetails = {
      showActivityFlowBadge: !activityFlow.hideBadge,
      activityFlowName: activityFlow.name,
      numberOfActivitiesInFlow: 0,
      activityPositionInFlow: 0,
    };

    const isInProgress = this.utility.isEventInProgress(
      event,
      assignment?.target.id || null,
    );

    let activity: Activity;

    if (isInProgress) {
      const progressionRecord = this.utility.getProgressionRecord(
        event,
        assignment?.target.id || null,
      ) as EntityProgressionInProgressActivityFlow;

      item.activityId = progressionRecord.currentActivityId;
      item.name = progressionRecord.currentActivityName;
      item.description = progressionRecord.currentActivityDescription;
      item.image = progressionRecord.currentActivityImage;
      item.activityFlowDetails.activityPositionInFlow =
        progressionRecord.pipelineActivityOrder + 1;
      item.activityFlowDetails.numberOfActivitiesInFlow =
        progressionRecord.totalActivitiesInPipeline;
    } else {
      activity = this.activities.find(
        x => x.id === activityFlow.activityIds[0],
      ) as Activity;

      item.activityId = activity.id;
      item.name = activity.name;
      item.description = activity.description;
      item.image = activity.image;
      item.activityFlowDetails.activityPositionInFlow = 1;
      item.activityFlowDetails.numberOfActivitiesInFlow =
        activityFlow.activityIds.length;
    }
  }

  private createListItem(appletId: string, eventActivity: EventEntity) {
    const { entity, event, assignment } = eventActivity;
    const { pipelineType } = eventActivity.entity;
    const isFlow = pipelineType === ActivityPipelineType.Flow;

    const item: ActivityListItem = {
      appletId,
      activityId: isFlow ? '' : entity.id,
      flowId: isFlow ? entity.id : null,
      eventId: event.id,
      targetSubjectId: assignment?.target.id || null,
      name: isFlow ? '' : entity.name,
      description: isFlow ? '' : entity.description,
      type: isFlow ? ActivityType.NotDefined : (entity as Activity).type,
      image: isFlow ? null : entity.image,
      status: ActivityStatus.NotDefined,
      isTimerSet: false,
      isExpired: false,
      timeLeftToComplete: null,
      isInActivityFlow: false,
    };

    if (isFlow) {
      this.populateActivityFlowFields(item, eventActivity);
    }
    return item;
  }

  public createAvailableItem(
    appletId: string,
    eventActivity: EventEntity,
  ): ActivityListItem {
    const item = this.createListItem(appletId, eventActivity);

    item.status = ActivityStatus.Available;

    const { event } = eventActivity;

    if (
      event.availability.availabilityType === AvailabilityType.ScheduledAccess
    ) {
      const to = this.availableToEvaluator.evaluate(event);
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

  public createScheduledItem(
    appletId: string,
    eventActivity: EventEntity,
  ): ActivityListItem {
    const item = this.createListItem(appletId, eventActivity);

    item.status = ActivityStatus.Scheduled;

    const { event } = eventActivity;

    const from = this.utility.getNow();
    from.setHours((event.availability.timeFrom as HourMinute).hours);
    from.setMinutes((event.availability.timeFrom as HourMinute).minutes);

    const isSpread = this.utility.isSpreadToNextDay(event);

    const to = isSpread ? this.utility.getTomorrow() : this.utility.getToday();
    to.setHours((event.availability.timeTo as HourMinute).hours);
    to.setMinutes((event.availability.timeTo as HourMinute).minutes);

    item.availableFrom = from;
    item.availableTo = to;

    return item;
  }

  public createProgressItem(
    appletId: string,
    eventActivity: EventEntity,
  ): ActivityListItem {
    const item = this.createListItem(appletId, eventActivity);

    item.status = ActivityStatus.InProgress;

    const { event, assignment } = eventActivity;

    item.isTimerSet = !!event.timers?.timer;

    if (item.isTimerSet) {
      const timeLeft = this.utility.getEventTimeToComplete(
        event,
        assignment?.target.id || null,
      );
      item.timeLeftToComplete = timeLeft;

      if (timeLeft === null) {
        item.isExpired = true;
      }
    }

    if (
      event.availability.availabilityType === AvailabilityType.ScheduledAccess
    ) {
      const progressionRecord = this.utility.getProgressionRecord(
        event,
        assignment?.target.id || null,
      );

      const availableUntilTimestamp = (
        progressionRecord as EntityProgressionInProgress
      ).availableUntilTimestamp;

      if (isEntityExpired(availableUntilTimestamp)) {
        item.isExpired = true;
      } else {
        if (availableUntilTimestamp) {
          item.availableTo = new Date(availableUntilTimestamp);
        } else {
          item.availableTo = null;
        }
      }
    }

    return item;
  }
}

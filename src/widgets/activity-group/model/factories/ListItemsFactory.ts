import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import {
  EntityProgressionInProgress,
  EntityProgressionInProgressActivityFlow,
} from '@app/abstract/lib/types/entityProgress';
import { AvailabilityType } from '@app/abstract/lib/types/event';
import {
  ActivityListItem,
  ActivityStatus,
  ActivityType,
} from '@app/entities/activity/lib/types/activityListItem';
import { AvailableToEvaluator } from '@app/entities/event/model/AvailableToEvaluator';
import { MIDNIGHT_DATE } from '@app/shared/lib/constants/dateTime';
import { HourMinute } from '@app/shared/lib/types/dateTime';
import { ILogger } from '@app/shared/lib/types/logger';
import { isEntityExpired } from '@app/shared/lib/utils/survey/survey';

import { GroupUtility } from './GroupUtility';
import {
  Activity,
  ActivityFlow,
  EventEntity,
  GroupsBuildContext,
} from '../../lib/types/activityGroupsBuilder';

export class ListItemsFactory {
  private utility: GroupUtility;
  private availableToEvaluator: AvailableToEvaluator;
  private logger: ILogger;
  protected activities: Activity[];

  constructor(inputParams: GroupsBuildContext, logger: ILogger) {
    this.utility = new GroupUtility(
      inputParams.appletId,
      inputParams.entityProgressions,
    );
    this.availableToEvaluator = new AvailableToEvaluator(this.utility);
    this.activities = inputParams.allAppletActivities;
    this.logger = logger;
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

    let activity: Activity | null;

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
      activity = this.safeGetActivity(activityFlow.activityIds[0]);

      if (activity) {
        item.activityId = activity.id;
        item.name = activity.name;
        item.description = activity.description;
        item.image = activity.image;
        item.activityFlowDetails.activityPositionInFlow = 1;
        item.activityFlowDetails.numberOfActivitiesInFlow =
          activityFlow.activityIds.length;
      } else {
        // Generate placeholder data for missing activity
        const placeholderData = this.generatePlaceholderActivityData(
          activityFlow.activityIds[0],
          activityFlow.name,
        );
        item.activityId = placeholderData.id;
        item.name = placeholderData.name;
        item.description = placeholderData.description;
        item.image = null;
        item.activityFlowDetails.activityPositionInFlow = 1;
        item.activityFlowDetails.numberOfActivitiesInFlow =
          activityFlow.activityIds.length;
      }
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

  /**
   * Safely retrieves an activity by ID with null checking
   * @param activityId - The activity ID to retrieve
   * @returns Activity if found, null otherwise
   */
  private safeGetActivity(activityId: string): Activity | null {
    try {
      const activity = this.activities.find(x => x.id === activityId);

      if (!activity) {
        this.logger.warn(
          `[ListItemsFactory.safeGetActivity]: Activity not found - activityId=${activityId}`,
        );
        return null;
      }

      return activity;
    } catch (error) {
      this.logger.warn(
        `[ListItemsFactory.safeGetActivity]: Error retrieving activity - activityId=${activityId}, error=${error}`,
      );
      return null;
    }
  }

  /**
   * Generates placeholder data for missing activities to prevent crashes
   * @param activityId - The missing activity ID
   * @param flowName - Name of the flow containing the missing activity
   * @returns Placeholder activity data
   */
  private generatePlaceholderActivityData(
    activityId: string,
    flowName: string,
  ): {
    id: string;
    name: string;
    description: string;
  } {
    this.logger.warn(
      `[ListItemsFactory.generatePlaceholderActivityData]: Generating placeholder for missing activity - activityId=${activityId}, flowName=${flowName}`,
    );

    return {
      id: activityId,
      name: 'Unavailable Activity',
      description: `This activity is no longer available. Please contact your administrator. (Flow: ${flowName})`,
    };
  }
}

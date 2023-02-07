import { isToday } from 'date-fns';

import {
  ActivityListItem,
  ActivityStatus,
  ActivityType,
} from '@app/entities/activity';
import {
  convertToTimeOnNoun,
  getMsFromHours,
  getMsFromMinutes,
  HourMinute,
  isTimeInInterval,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
} from '@app/shared/lib';

import {
  EventActivity,
  ActivityGroupsBuilder,
  ActivityGroupType,
  ActivityGroupTypeNames,
  ActivityListGroup,
  Activity,
  ActivityFlow,
  ActivityPipelineType,
  EntityProgress,
  AppletId,
  ProgressPayload,
  ActivityFlowProgress,
  AvailabilityType,
} from '../../lib';

const createActivityGroupsBuilder = (data: {
  allAppletActivities: Activity[];
  progress: EntityProgress;
  appletId: AppletId;
}): ActivityGroupsBuilder => {
  const { progress, appletId, allAppletActivities: activities } = data;

  const getNow = () => new Date();

  const isEventActivityInProgress = (eventActivity: EventActivity): boolean => {
    const record = getProgressRecord(eventActivity);
    if (!record) {
      return false;
    }
    return !!record.startAt && !record.endAt;
  };

  const getProgressRecord = (
    eventActivity: EventActivity,
  ): ProgressPayload | null => {
    const record =
      progress[appletId][eventActivity.activity.id][eventActivity.event.id];
    return record ?? null;
  };

  const getStartedDateTime = (eventActivity: EventActivity): Date => {
    const record = getProgressRecord(eventActivity)!;
    return record.startAt!;
  };

  const populateActivityFlowFields = (
    item: ActivityListItem,
    activityEvent: EventActivity,
  ) => {
    const activityFlow = activityEvent.activity as ActivityFlow;

    item.isInActivityFlow = true;
    item.activityFlowDetails = {
      showActivityFlowBadge: !activityFlow.hideBadge,
      activityFlowName: activityFlow.name,
      numberOfActivitiesInFlow: activityFlow.items.length,
      activityPositionInFlow: 0,
    };

    const isInProgress = isEventActivityInProgress(activityEvent);

    if (isInProgress) {
      const progressRecord = getProgressRecord(
        activityEvent,
      ) as ActivityFlowProgress;

      const activity = activities.find(
        x => x.id === progressRecord.currentActivityId,
      )!;
      const position =
        activityFlow.items.findIndex(x => x.activityId === activity.id) + 1;
      item.activityFlowDetails.activityPositionInFlow = position;
      item.name = activity.name;
      item.description = activity.description;
      item.type = activity.type;
    } else {
      const activity = data.allAppletActivities.find(
        x => x.id === activityFlow.items[0].activityId,
      )!;
      item.activityFlowDetails.activityPositionInFlow = 1;
      item.name = activity.name;
      item.description = activity.description;
      item.type = activity.type;
    }
  };

  const getTimeToComplete = (eventActivity: EventActivity): HourMinute => {
    const { event } = eventActivity;
    const timer = event.timers.timer!;

    const startedTime = getStartedDateTime(eventActivity);

    const activityDuration: number =
      getMsFromHours(timer.hours) + getMsFromMinutes(timer.minutes);

    const alreadyElapsed: number = new Date().getTime() - startedTime.getTime();

    if (alreadyElapsed < activityDuration) {
      const left: number = activityDuration - alreadyElapsed;

      const hours = Math.floor(left / MINUTES_IN_HOUR / MS_IN_MINUTE);
      const minutes = (left - getMsFromHours(hours)) / MS_IN_MINUTE;

      return { hours, minutes };
    } else {
      return { hours: 0, minutes: 0 };
    }
  };

  const createListItem = (eventActivity: EventActivity) => {
    const { activity, event } = eventActivity;
    const { pipelineType } = eventActivity.activity;
    const isFlow = pipelineType === ActivityPipelineType.Flow;

    const item: ActivityListItem = {
      activityId: activity.id,
      eventId: event.id,
      name: isFlow ? '' : activity.name,
      description: isFlow ? '' : activity.description,
      type: isFlow ? ActivityType.NotDefined : (activity as Activity).type,
      image: activity.image,
      status: ActivityStatus.NotDefined,
      isAccessBeforeStartTime: false,
      isTimeIntervalSet: true,
      isTimerSet: false,
      timeLeftToComplete: null,
      isInActivityFlow: false,
    };

    if (isFlow) {
      populateActivityFlowFields(item, eventActivity);
    }
    return item;
  };

  function buildInProgress(
    eventsActivities: Array<EventActivity>,
  ): ActivityListGroup {
    const filtered = eventsActivities.filter(x => isEventActivityInProgress(x));

    const activityItems: Array<ActivityListItem> = [];

    for (let eventActivity of filtered) {
      const item = createListItem(eventActivity);

      item.status = ActivityStatus.InProgress;

      const { event } = eventActivity;
      item.isTimerSet = !!event.timers.timer;
      item.timeLeftToComplete = event.timers.timer
        ? getTimeToComplete(eventActivity)
        : null;

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.InProgress],
      type: ActivityGroupType.InProgress,
    };

    return result;
  }

  function buildAvailable(
    eventsActivities: Array<EventActivity>,
  ): ActivityListGroup {
    const notInProgress = eventsActivities.filter(
      x => !isEventActivityInProgress(x),
    );

    const now = getNow();

    const filtered: Array<EventActivity> = [];

    const activityItems: Array<ActivityListItem> = [];

    for (let eventActivity of notInProgress) {
      const { event } = eventActivity;

      const typeIsAlwaysAvailable =
        event.availability.availabilityType ===
        AvailabilityType.AlwaysAvailable;

      const oneTimeCompletion = event.availability.oneTimeCompletion;

      const endAt = getProgressRecord(eventActivity)?.endAt;

      const completedToday = !!endAt && isToday(endAt);

      const neverCompleted = !endAt;

      const scheduledToday = isToday(event.scheduledAt);

      const isCurrentTimeInTimeWindow = isTimeInInterval(
        { hours: now.getHours(), minutes: now.getMinutes() },
        event.availability.timeFrom,
        event.availability.timeTo,
      );

      const conditionForAlwaysAvailable =
        typeIsAlwaysAvailable &&
        ((oneTimeCompletion && neverCompleted) || !oneTimeCompletion);

      const conditionForScheduled =
        scheduledToday &&
        now > event.scheduledAt &&
        isCurrentTimeInTimeWindow &&
        !completedToday;

      if (conditionForAlwaysAvailable || conditionForScheduled) {
        filtered.push(eventActivity);
      }
    }

    for (let eventActivity of filtered) {
      const item = createListItem(eventActivity);

      item.status = ActivityStatus.Available;

      const { event } = eventActivity;

      const to = getNow();
      to.setHours(event.availability.timeTo.hours);
      to.setMinutes(event.availability.timeTo.minutes);

      item.availableTo = convertToTimeOnNoun(to);

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.Available],
      type: ActivityGroupType.Available,
    };

    return result;
  }

  function buildScheduled(
    eventsActivities: Array<EventActivity>,
  ): ActivityListGroup {
    const notInProgress = eventsActivities.filter(
      x => !isEventActivityInProgress(x),
    );

    const activityItems: Array<ActivityListItem> = [];

    const filtered: Array<EventActivity> = [];

    const now = getNow();

    for (let eventActivity of notInProgress) {
      const { event } = eventActivity;

      const typeIsScheduled =
        event.availability.availabilityType ===
        AvailabilityType.ScheduledAccess;

      const accessBeforeTimeFrom = event.availability.allowAccessBeforeFromTime;

      const endAt = getProgressRecord(eventActivity)?.endAt;

      const completedToday = !!endAt && isToday(endAt);

      const scheduledToday = isToday(event.scheduledAt);

      if (
        typeIsScheduled &&
        scheduledToday &&
        now < event.scheduledAt &&
        !accessBeforeTimeFrom &&
        !completedToday
      ) {
        filtered.push(eventActivity);
      }
    }

    for (let eventActivity of filtered) {
      const item = createListItem(eventActivity);

      item.status = ActivityStatus.Scheduled;

      const { event } = eventActivity;

      const from = getNow();
      from.setHours(event.availability.timeFrom.hours);
      from.setMinutes(event.availability.timeFrom.minutes);

      const to = getNow();
      to.setHours(event.availability.timeTo.hours);
      to.setMinutes(event.availability.timeTo.minutes);

      item.availableFrom = convertToTimeOnNoun(from);
      item.availableTo = convertToTimeOnNoun(to);

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.Scheduled],
      type: ActivityGroupType.Scheduled,
    };

    return result;
  }

  return {
    buildInProgress,
    buildAvailable,
    buildScheduled,
  };
};

export default createActivityGroupsBuilder;

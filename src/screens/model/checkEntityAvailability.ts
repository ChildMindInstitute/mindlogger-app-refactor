import { QueryClient } from '@tanstack/react-query';

import { StoreProgress } from '@app/abstract/lib';
import { ActivityListItem } from '@app/entities/activity';
import {
  onActivityNotFound,
  onScheduledToday,
} from '@app/features/tap-on-notification/lib';
import {
  ActivityGroupType,
  ActivityGroupsModel,
  ActivityListGroup,
} from '@app/widgets/activity-group';

type Input = {
  identifiers: {
    appletId: string;
    activityId: string | null;
    flowId: string | null;
    eventId: string;
  };
  storeProgress: StoreProgress;
  queryClient: QueryClient;
};

export const checkEntityAvailability = ({
  identifiers: { appletId, activityId, flowId, eventId },
  storeProgress,
  queryClient,
}: Input) => {
  const groupsResult = ActivityGroupsModel.ActivityGroupsBuildManager.process(
    appletId,
    storeProgress,
    queryClient,
  );

  const groupInProgress: ActivityListGroup = groupsResult.groups.find(
    x => x.type === ActivityGroupType.InProgress,
  )!;

  const groupAvailable: ActivityListGroup = groupsResult.groups.find(
    x => x.type === ActivityGroupType.Available,
  )!;

  const groupScheduled: ActivityListGroup = groupsResult.groups.find(
    x => x.type === ActivityGroupType.Scheduled,
  )!;

  if (
    [...groupAvailable.activities, ...groupInProgress.activities].some(
      x =>
        x.eventId === eventId &&
        ((flowId && flowId === x.flowId) ||
          (!flowId && activityId === x.activityId)),
    )
  ) {
    return true;
  }

  const scheduled: ActivityListItem | undefined =
    groupScheduled.activities.find(
      x =>
        x.eventId === eventId &&
        ((flowId && flowId === x.flowId) ||
          (!flowId && activityId === x.activityId)),
    );

  if (scheduled) {
    onScheduledToday(
      flowId ? scheduled.activityFlowDetails!.activityFlowName : scheduled.name,
      scheduled.availableFrom!,
    );
    return false;
  }

  onActivityNotFound();

  return false;
};

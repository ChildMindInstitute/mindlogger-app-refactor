import { QueryClient } from '@tanstack/react-query';
import { isToday } from 'date-fns';

import { EntityPath, StoreProgress } from '@app/abstract/lib';
import { ActivityListItem } from '@app/entities/activity';
import {
  onActivityNotAvailable,
  onCompletedToday,
  onScheduledToday,
} from '@app/features/tap-on-notification/lib';
import {
  getEntityProgress,
  getNow,
  ILogger,
  isReadyForAutocompletion,
  Logger,
} from '@app/shared/lib';
import {
  ActivityGroupType,
  ActivityGroupsModel,
  ActivityListGroup,
} from '@app/widgets/activity-group';

type Input = {
  entityName: string;
  identifiers: EntityPath;
  storeProgress: StoreProgress;
  queryClient: QueryClient;
};

const logger: ILogger = Logger;

/*
In case if entity is in progress and it's ready for autocompletion - we have to decide if we
need to start this entity again. To decide that - we pass this entity through available and scheduled group evaluators.
applyInProgressFilter is set false is this case  so that the ActivityGroupsBuilder will include
the entity into the inputs of the mentioned groups' evaluators.
*/

export const checkEntityAvailability = ({
  entityName,
  identifiers: { appletId, entityId, entityType, eventId },
  storeProgress,
  queryClient,
}: Input) => {
  logger.log(
    `[checkEntityAvailability]: Checking.. Entity = "${entityName}", appletId = ${appletId}, entityId = ${entityId}, entityType = ${entityType}, eventId = ${eventId} `,
  );

  const record = getEntityProgress(appletId, entityId, eventId, storeProgress);

  Logger.log(
    `[checkEntityAvailability] Now is ${getNow().toUTCString()}, record = ${JSON.stringify(record)}`,
  );

  const shouldBeAutocompleted = isReadyForAutocompletion(
    { appletId, entityId, eventId, entityType },
    storeProgress,
  );

  const applyInProgressFilter = !shouldBeAutocompleted;

  Logger.log(
    `[checkEntityAvailability] applyInProgressFilter is set to ${applyInProgressFilter}`,
  );

  const groupsResult = ActivityGroupsModel.ActivityGroupsBuildManager.process(
    appletId,
    storeProgress,
    queryClient,
    applyInProgressFilter,
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
        ((entityType === 'flow' && entityId === x.flowId) ||
          (entityType === 'regular' && entityId === x.activityId)),
    )
  ) {
    logger.log('[checkEntityAvailability] Check done: true');

    return true;
  }

  const scheduled: ActivityListItem | undefined =
    groupScheduled.activities.find(
      x =>
        x.eventId === eventId &&
        ((entityType === 'flow' && entityId === x.flowId) ||
          (entityType === 'regular' && entityId === x.activityId)),
    );

  if (scheduled) {
    onScheduledToday(entityName, scheduled.availableFrom!);

    logger.log('[checkEntityAvailability] Check done: false (scheduled today)');

    return false;
  }

  const completedToday = record && record.endAt && isToday(record.endAt);

  if (completedToday) {
    logger.log('[checkEntityAvailability] Check done: false (completed today)');

    onCompletedToday(entityName);
  } else {
    logger.log('[checkEntityAvailability] Check done: false (not available)');

    onActivityNotAvailable();
  }

  return false;
};

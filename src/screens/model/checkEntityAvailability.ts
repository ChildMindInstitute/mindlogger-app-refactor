import { QueryClient } from '@tanstack/react-query';

import { EntityPath, StoreProgress, convertProgress } from '@app/abstract/lib';
import { EventModel } from '@app/entities/event';
import { mapEventFromDto } from '@app/entities/event/model';
import {
  onActivityNotAvailable,
  onCompletedToday,
  onScheduledToday,
} from '@app/features/tap-on-notification/lib';
import { QueryDataUtils } from '@app/shared/api';
import {
  getEntityProgress,
  getNow,
  ILogger,
  isCompletedToday,
  isEntityInProgress,
  isReadyForAutocompletion,
  Logger,
} from '@app/shared/lib';
import { ActivityGroupsModel } from '@app/widgets/activity-group';
import { GroupUtility } from '@app/widgets/activity-group/model';

type Input = {
  entityName: string;
  identifiers: EntityPath;
  storeProgress: StoreProgress;
  queryClient: QueryClient;
  alertCallback: () => void;
};

const logger: ILogger = Logger;

export const checkEntityAvailability = ({
  entityName,
  identifiers: { appletId, entityId, entityType, eventId },
  storeProgress,
  queryClient,
  alertCallback,
}: Input): boolean => {
  const record = getEntityProgress(appletId, entityId, eventId, storeProgress);

  logger.log(
    `[checkEntityAvailability]: Checking.. Entity = "${entityName}", appletId = ${appletId}, entityId = ${entityId}, entityType = ${entityType}, eventId = ${eventId} `,
  );

  Logger.log(
    `[checkEntityAvailability] Now is ${getNow().toUTCString()}, record = ${JSON.stringify(record)}`,
  );

  const isInProgress = isEntityInProgress(record);

  const shouldBeAutocompleted = isReadyForAutocompletion(
    { appletId, entityId, eventId, entityType },
    storeProgress,
  );

  if (isInProgress && !shouldBeAutocompleted) {
    logger.log('[checkEntityAvailability] Check done: true (in-progress)');

    return true;
  }

  const progress = convertProgress(storeProgress);

  const queryUtils = new QueryDataUtils(queryClient);

  const event = mapEventFromDto(queryUtils.getEventDto(appletId, eventId));

  event.scheduledAt = EventModel.ScheduledDateCalculator.calculate(event);

  if (!event.scheduledAt) {
    logger.log(
      '[checkEntityAvailability] Check done: false (scheduledAt is missed)',
    );

    return false;
  }

  const isAvailable = new ActivityGroupsModel.AvailableGroupEvaluator(
    progress,
    appletId,
  ).isInGroup(event);

  const isScheduled = new ActivityGroupsModel.ScheduledGroupEvaluator(
    progress,
    appletId,
  ).isInGroup(event);

  if (isAvailable) {
    logger.log('[checkEntityAvailability] Check done: true (available)');

    return true;
  }

  if (isScheduled) {
    const from = getNow();
    const { timeFrom } = event.availability;

    from.setHours(timeFrom!.hours);
    from.setMinutes(timeFrom!.minutes);

    logger.log('[checkEntityAvailability] Check done: false (scheduled today)');

    onScheduledToday(entityName, from, alertCallback);

    return false;
  }

  const isEntityCompletedToday = isCompletedToday(record);

  const isSpread = GroupUtility.isSpreadToNextDay(event);

  if (isEntityCompletedToday && !isSpread) {
    logger.log(
      '[checkEntityAvailability] Check done: false (completed today, not spread)',
    );

    onCompletedToday(entityName, alertCallback);

    return false;
  }

  logger.log('[checkEntityAvailability] Check done: false (not available)');

  onActivityNotAvailable(alertCallback);

  return false;
};

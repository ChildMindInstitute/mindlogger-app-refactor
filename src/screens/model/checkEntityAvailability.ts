import { QueryClient } from '@tanstack/react-query';

import { EntityPath, StoreProgress, convertProgress } from '@app/abstract/lib';
import { EventModel } from '@app/entities/event';
import { mapEventFromDto } from '@app/entities/event/model';
import {
  onActivityNotAvailable,
  onAppWasKilledOnReduxPersist,
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
import { isCurrentActivityRecordExist } from '@app/widgets/survey';

type Input = {
  entityName: string;
  identifiers: EntityPath;
  storeProgress: StoreProgress;
  queryClient: QueryClient;
};

type InputInternal = Input & {
  entityName: string;
  identifiers: EntityPath;
  storeProgress: StoreProgress;
  queryClient: QueryClient;
  callback: (result: boolean) => void;
};

const logger: ILogger = Logger;

const checkEntityAvailabilityInternal = ({
  entityName,
  identifiers: { appletId, entityId, entityType, eventId },
  storeProgress,
  queryClient,
  callback,
}: InputInternal): void => {
  const record = getEntityProgress(appletId, entityId, eventId, storeProgress);

  logger.log(
    `[checkEntityAvailability]: Checking.. Entity = "${entityName}", appletId = "${appletId}", entityId = "${entityId}", entityType = "${entityType}", eventId = "${eventId}"`,
  );

  Logger.log(
    `[checkEntityAvailability] record = ${JSON.stringify(record, null, 2)}`,
  );

  const isInProgress = isEntityInProgress(record);

  const flowId = entityType === 'flow' ? entityId : undefined;

  if (
    isInProgress &&
    !isCurrentActivityRecordExist(flowId, appletId, eventId)
  ) {
    logger.log(
      '[checkEntityAvailability] Check done: false (app killed during redux persist)',
    );

    onAppWasKilledOnReduxPersist(() => callback(false));
    return;
  }

  const shouldBeAutocompleted = isReadyForAutocompletion(
    { appletId, entityId, eventId, entityType },
    storeProgress,
  );

  if (isInProgress && !shouldBeAutocompleted) {
    logger.log('[checkEntityAvailability] Check done: true (in-progress)');

    callback(true);
    return;
  }

  const progress = convertProgress(storeProgress);

  const queryUtils = new QueryDataUtils(queryClient);

  const event = mapEventFromDto(queryUtils.getEventDto(appletId, eventId));

  event.scheduledAt = EventModel.ScheduledDateCalculator.calculate(event);

  if (!event.scheduledAt) {
    logger.log(
      '[checkEntityAvailability] Check done: false (scheduledAt is missed)',
    );

    callback(false);
    return;
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

    callback(true);
    return;
  }

  if (isScheduled) {
    const from = getNow();
    const { timeFrom } = event.availability;

    from.setHours(timeFrom!.hours);
    from.setMinutes(timeFrom!.minutes);

    logger.log('[checkEntityAvailability] Check done: false (scheduled today)');

    onScheduledToday(entityName, from, () => callback(false));
    return;
  }

  const isEntityCompletedToday = isCompletedToday(record);

  const isSpread = GroupUtility.isSpreadToNextDay(event);

  if (isEntityCompletedToday && !isSpread) {
    logger.log(
      '[checkEntityAvailability] Check done: false (completed today, not spread)',
    );

    onCompletedToday(entityName, () => callback(false));
    return;
  }

  logger.log('[checkEntityAvailability] Check done: false (not available)');

  onActivityNotAvailable(() => callback(false));
};

export const checkEntityAvailability = ({
  entityName,
  identifiers,
  storeProgress,
  queryClient,
}: Input): Promise<boolean> => {
  return new Promise(resolve => {
    const onCheckDone = (result: boolean) => {
      resolve(result);
    };

    checkEntityAvailabilityInternal({
      entityName,
      identifiers,
      storeProgress,
      queryClient,
      callback: onCheckDone,
    });
  });
};

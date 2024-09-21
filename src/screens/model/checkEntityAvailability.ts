import { QueryClient } from '@tanstack/react-query';

import { EntityPath, EntityProgression } from '@app/abstract/lib';
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
  getEntityProgression,
  getNow,
  ILogger,
  isEntityProgressionInProgress,
  isProgressionCompletedToday,
  isProgressionReadyForAutocompletion,
  Logger,
} from '@app/shared/lib';
import { ActivityGroupsModel } from '@app/widgets/activity-group';
import { GroupUtility } from '@app/widgets/activity-group/model';
import { isCurrentActivityRecordExist } from '@app/widgets/survey';

type Input = {
  entityName: string;
  identifiers: EntityPath;
  entityProgressions: EntityProgression[];
  queryClient: QueryClient;
};

type InputInternal = Input & {
  callback: (result: boolean) => void;
};

const logger: ILogger = Logger;

const checkEntityAvailabilityInternal = ({
  entityName,
  identifiers: { appletId, entityId, entityType, eventId, targetSubjectId },
  entityProgressions,
  queryClient,
  callback,
}: InputInternal): void => {
  const progression = getEntityProgression(
    appletId,
    entityId,
    eventId,
    targetSubjectId,
    entityProgressions,
  );

  logger.log(
    `[checkEntityAvailability]: Checking.. Entity = "${entityName}", appletId = "${appletId}", entityId = "${entityId}", entityType = "${entityType}", eventId = "${eventId}", targetSubjectId = "${targetSubjectId || 'NULL'}"`,
  );

  Logger.log(
    `[checkEntityAvailability] record = ${JSON.stringify(progression, null, 2)}`,
  );

  const isInProgress = isEntityProgressionInProgress(progression);
  const flowId = entityType === 'flow' ? entityId : undefined;

  // TODO: M2-7407 - Maybe make this part idempotent? If the activity record
  //                 does exist, maybe we should just restart the activity and
  //                 recreate the record (instead of just not letting people
  //                 pass)?
  if (
    isInProgress &&
    !isCurrentActivityRecordExist(flowId, appletId, eventId, targetSubjectId)
  ) {
    logger.log(
      '[checkEntityAvailability] Check done: false (app killed during redux persist)',
    );

    onAppWasKilledOnReduxPersist(() => callback(false));
    return;
  }

  const shouldBeAutocompleted = isProgressionReadyForAutocompletion(
    { appletId, entityId, eventId, entityType, targetSubjectId },
    entityProgressions,
  );

  if (isInProgress && !shouldBeAutocompleted) {
    logger.log('[checkEntityAvailability] Check done: true (in-progress)');

    callback(true);
    return;
  }

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
    appletId,
  ).isEventInGroup(event, targetSubjectId);

  const isScheduled = new ActivityGroupsModel.ScheduledGroupEvaluator(
    appletId,
    entityProgressions,
  ).isEventInGroup(event, targetSubjectId);

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

  const isEntityCompletedToday = isProgressionCompletedToday(progression);

  const isSpread = GroupUtility.isSpreadToNextDay(event);

  if (isEntityCompletedToday && !isSpread) {
    logger.log(
      '[checkEntityAvailability] Check done: false (completed today, not spread)',
    );

    onCompletedToday(entityName, () => callback(false));
    return;
  }

  logger.log('[checkEntityAvailability] Check done: false (not available)');

  onActivityNotAvailable(entityName, () => callback(false));
};

export const checkEntityAvailability = ({
  entityName,
  identifiers,
  entityProgressions,
  queryClient,
}: Input): Promise<boolean> => {
  return new Promise(resolve => {
    const onCheckDone = (result: boolean) => {
      resolve(result);
    };

    checkEntityAvailabilityInternal({
      entityName,
      identifiers,
      entityProgressions,
      queryClient,
      callback: onCheckDone,
    });
  });
};

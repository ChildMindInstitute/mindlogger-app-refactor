import { QueryClient } from '@tanstack/react-query';

import { EntityPath } from '@app/abstract/lib/types/entity';
import { EntityProgression } from '@app/abstract/lib/types/entityProgress';
import { mapEventFromDto } from '@app/entities/event/model/mappers';
import { getDefaultScheduledDateCalculator } from '@app/entities/event/model/operations/scheduledDateCalculatorInstance';
import {
  onActivityNotAvailable,
  onAppWasKilledOnReduxPersist,
  onCompletedToday,
  onScheduledToday,
} from '@app/features/tap-on-notification/lib/alerts';
import { QueryDataUtils } from '@app/shared/api/services/QueryDataUtils';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { getNow } from '@app/shared/lib/utils/dateTime';
import {
  getEntityProgression,
  isEntityProgressionInProgress,
  isProgressionCompletedToday,
  isProgressionReadyForAutocompletion,
} from '@app/shared/lib/utils/survey/survey';
import { AvailableGroupEvaluator } from '@app/widgets/activity-group/model/factories/AvailableGroupEvaluator';
import { GroupUtility } from '@app/widgets/activity-group/model/factories/GroupUtility';
import { ScheduledGroupEvaluator } from '@app/widgets/activity-group/model/factories/ScheduledGroupEvaluator';
import { isCurrentActivityRecordExist } from '@app/widgets/survey/lib/storageHelpers';

type Input = {
  entityName: string;
  identifiers: EntityPath;
  entityProgressions: EntityProgression[];
  queryClient: QueryClient;
};

type InputInternal = Input & {
  callback: (result: boolean) => void;
};

const logger: ILogger = getDefaultLogger();

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

  logger.log(
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

  event.scheduledAt = getDefaultScheduledDateCalculator().calculate(event);

  if (!event.scheduledAt) {
    logger.log(
      '[checkEntityAvailability] Check done: false (scheduledAt is missed)',
    );

    callback(false);
    return;
  }

  const isAvailable = new AvailableGroupEvaluator(
    appletId,
    entityProgressions,
  ).isEventInGroup(event, targetSubjectId);

  const isScheduled = new ScheduledGroupEvaluator(
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

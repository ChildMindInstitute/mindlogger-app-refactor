import { QueryClient } from '@tanstack/react-query';

import { EntityPath } from '@app/abstract/lib/types/entity';
import { EntityProgression } from '@app/abstract/lib/types/entityProgress';
import { reduxStore } from '@app/app/ui/AppProvider/ReduxProvider';
import { selectAppletsEntityProgressions } from '@app/entities/applet/model/selectors';
import { mapEventFromDto } from '@app/entities/event/model/mappers';
import { getDefaultScheduledDateCalculator } from '@app/entities/event/model/operations/scheduledDateCalculatorInstance';
import { selectUserId } from '@app/entities/identity/model/selectors';
import {
  onActivityNotAvailable,
  onAppWasKilledOnReduxPersist,
  onCompletedToday,
  onNotAssigned,
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

const FORCE_RECREATE_RECORD = true;

const checkEntityAvailabilityInternal = ({
  entityName,
  identifiers: { appletId, entityId, entityType, eventId, targetSubjectId },
  entityProgressions,
  queryClient,
  callback,
}: InputInternal): void => {
  // Always fetch the freshest progressions from the store to avoid stale closures
  const freshProgressions: EntityProgression[] =
    selectAppletsEntityProgressions(reduxStore.getState());

  const progression = getEntityProgression(
    appletId,
    entityId,
    eventId,
    targetSubjectId,
    freshProgressions,
  );

  logger.log(
    `[checkEntityAvailability]: Checking.. Entity = "${entityName}", appletId = "${appletId}", entityId = "${entityId}", entityType = "${entityType}", eventId = "${eventId}", targetSubjectId = "${targetSubjectId || 'NULL'}"`,
  );

  logger.log(
    `[checkEntityAvailability] record = ${JSON.stringify(progression, null, 2)}`,
  );

  const isInProgress = isEntityProgressionInProgress(progression);

  if (
    isInProgress &&
    !isCurrentActivityRecordExist(
      entityType === 'flow' ? entityId : undefined,
      appletId,
      eventId,
      targetSubjectId,
    )
  ) {
    logger.warn(
      '[checkEntityAvailability] Check done: false (app killed during redux persist)',
    );

    // TODO: M2-7407 - Maybe make this part idempotent? If the activity record
    //                 does exist, maybe we should just restart the activity and
    //                 recreate the record (instead of just not letting people
    //                 pass)?
    if (!FORCE_RECREATE_RECORD) {
      onAppWasKilledOnReduxPersist(() => callback(false));
      return;
    }
  }

  const shouldBeAutocompleted = isProgressionReadyForAutocompletion(
    { appletId, entityId, eventId, entityType, targetSubjectId },
    freshProgressions,
  );

  if (isInProgress && !shouldBeAutocompleted) {
    logger.log('[checkEntityAvailability] Check done: true (in-progress)');

    callback(true);
    return;
  }

  const queryUtils = new QueryDataUtils(queryClient);

  // Check assignment before other validations
  const appletDetails = queryUtils.getAppletDto(appletId);
  const entity =
    entityType === 'flow'
      ? appletDetails?.activityFlows.find(f => f.id === entityId)
      : appletDetails?.activities.find(a => a.id === entityId);

  if (!entity) {
    logger.log(
      '[checkEntityAvailability] Check done: false (entity not found)',
    );
    callback(false);
    return;
  }

  // Auto-assigned activities are available to everyone
  if (!entity.autoAssign) {
    // Manual assignment - need to check if user has assignment
    const currentUserId = selectUserId(reduxStore.getState());
    const assignments = queryUtils.getAssignmentsDto(appletId);

    logger.log(
      `[checkEntityAvailability] Checking assignments for user="${currentUserId}", entityId="${entityId}", entityType="${entityType}"`,
    );

    const hasAssignment = assignments?.some(assignment => {
      const matchesEntity =
        entityType === 'flow'
          ? assignment.activityFlowId === entityId
          : assignment.activityId === entityId;

      if (!matchesEntity) return false;

      const isRespondent = assignment.respondentSubject.userId === currentUserId;

      // For self-reports (no targetSubjectId), respondent must equal target
      if (!targetSubjectId) {
        return (
          isRespondent &&
          assignment.respondentSubject.id === assignment.targetSubject.id
        );
      }

      // For assessments of others, check target matches
      return isRespondent && assignment.targetSubject.id === targetSubjectId;
    });

    if (!hasAssignment) {
      logger.log('[checkEntityAvailability] Check done: false (not assigned)');
      onNotAssigned(entityName, () => callback(false));
      return;
    }
  }

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
    freshProgressions,
  ).isEventInGroup(event, targetSubjectId);

  const isScheduled = new ScheduledGroupEvaluator(
    appletId,
    freshProgressions,
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

  // Use the same logic as the activity list to check if completed
  // The activity list uses GroupUtility.isEventCompletedToday which checks endedAtTimestamp
  // The progression might still show "in-progress" status even after completion
  const groupUtility = new GroupUtility(appletId, entityProgressions);
  const isCompletedUsingGroupUtility = groupUtility.isEventCompletedToday(
    event,
    targetSubjectId,
  );

  const isEntityCompletedToday = isProgressionCompletedToday(progression);
  const isSpread = GroupUtility.isSpreadToNextDay(event);

  // Check both ways - if either says completed, block access
  if ((isEntityCompletedToday && !isSpread) || isCompletedUsingGroupUtility) {
    logger.log('[checkEntityAvailability] Check done: false (completed today)');
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

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
import { mapAssignmentsFromDto } from '@app/widgets/activity-group/model/mappers';
import { AvailableGroupEvaluator } from '@app/widgets/activity-group/model/factories/AvailableGroupEvaluator';
import { GroupUtility } from '@app/widgets/activity-group/model/factories/GroupUtility';
import { ScheduledGroupEvaluator } from '@app/widgets/activity-group/model/factories/ScheduledGroupEvaluator';
import { isCurrentActivityRecordExist } from '@app/widgets/survey/lib/storageHelpers';

type Input = {
  entityName: string;
  identifiers: EntityPath;
  entityProgressions: EntityProgression[];
  queryClient: QueryClient;
  isFromNotification?: boolean; // Only validate assignments for notification taps
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
  isFromNotification = false,
  callback,
}: InputInternal): void => {
  console.log('[DEBUG] ============ CHECK ENTITY AVAILABILITY ============');
  console.log('[DEBUG] Input:', {
    entityName,
    appletId,
    entityId,
    entityType,
    eventId,
    targetSubjectId,
    isFromNotification,
  });

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

  const queryUtils = new QueryDataUtils(queryClient);
  console.log('[DEBUG] Created QueryDataUtils');

  // ONLY validate assignments for notification taps (M2-8698)
  // Activity list already filters by assignments, so skip validation for list taps
  // IMPORTANT: Check assignments BEFORE allowing in-progress activities to continue
  if (isFromNotification) {
    console.log('[DEBUG] isFromNotification=true, checking assignments');
    const appletDetails = queryUtils.getAppletDto(appletId);
    console.log('[DEBUG] appletDetails exists?', !!appletDetails);

    const entity =
      entityType === 'flow'
        ? appletDetails?.activityFlows.find(f => f.id === entityId)
        : appletDetails?.activities.find(a => a.id === entityId);

    console.log('[DEBUG] entity found?', !!entity);
    console.log('[DEBUG] entity:', entity ? { id: entity.id, name: entity.name, autoAssign: entity.autoAssign } : null);

    if (!entity) {
      console.log('[DEBUG] RETURN FALSE: entity not found in appletDetails');
      logger.log(
        '[checkEntityAvailability] Check done: false (entity not found)',
      );
      callback(false);
      return;
    }

    // Auto-assigned activities are available to everyone
    if (!entity.autoAssign) {
      // Manual assignment - check if assignment exists (matching activity list logic)
      const assignments = queryUtils.getAssignmentsDto(appletId);
      const currentUserId = selectUserId(reduxStore.getState());

      logger.log(
        `[checkEntityAvailability] Notification tap: validating assignment for entityId="${entityId}", entityType="${entityType}", targetSubjectId="${targetSubjectId || 'NULL'}", currentUserId="${currentUserId || 'NULL'}"`,
      );

      // Match ActivityGroupsBuildManager logic - check if assignment exists for entity+target
      const normalizedAssignments = assignments
        ? mapAssignmentsFromDto(assignments)
        : [];

      const hasAssignment = normalizedAssignments.some(assignment => {
        const matchesEntity =
          entityType === 'flow'
            ? assignment.__type === 'activityFlow' &&
              assignment.activityFlowId === entityId
            : assignment.__type === 'activity' &&
              assignment.activityId === entityId;

        if (!matchesEntity) {
          return false;
        }

        const { respondent, target } = assignment;

        if (!respondent || !target) {
          logger.warn(
            '[checkEntityAvailability] Assignment is missing respondent or target data; skipping entry',
          );
          return false;
        }

        const respondentUserId = respondent.userId;
        const isSelfAssignment = respondent.id === target.id;

        // Check if this assignment is for the current user
        if (respondentUserId && currentUserId) {
          // If both IDs exist, they must match
          if (respondentUserId !== currentUserId) {
            return false;
          }
        } else if (respondentUserId && !currentUserId) {
          // Assignment has userId but current user doesn't - skip this assignment
          logger.log(
            '[checkEntityAvailability] Assignment has userId but current user is not logged in; skipping',
          );
          return false;
        }
        // If respondentUserId is null/undefined, we'll check based on target matching below

        // For self-reports (no targetSubjectId), check if it's a self-assignment
        if (!targetSubjectId) {
          return isSelfAssignment;
        }

        // For assessments of others, check if target matches
        if (target.id !== targetSubjectId) {
          return false;
        }

        // If we reach here, we matched entity + target
        // When respondent.userId is absent, we allow the assignment based on target match
        // This mirrors the activity list behavior from ActivityGroupsBuildManager (M2-9876)
        if (!respondentUserId) {
          logger.log(
            '[checkEntityAvailability] Assignment matched without respondent userId; allowing based on entity+target match',
          );
        }

        return true;
      });

      if (!hasAssignment) {
        logger.log(
          '[checkEntityAvailability] Check done: false (not assigned - notification blocked)',
        );
        onNotAssigned(entityName, () => callback(false));
        return;
      }
    }
  }

  // Check in-progress status AFTER assignment validation for notification taps
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
  isFromNotification = false,
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
      isFromNotification,
      callback: onCheckDone,
    });
  });
};
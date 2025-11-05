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
  onScheduledToday,
  showNotAssignedToast,
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
import { mapAssignmentsFromDto } from '@app/widgets/activity-group/model/mappers';
import { isCurrentActivityRecordExist } from '@app/widgets/survey/lib/storageHelpers';

type Input = {
  entityName: string;
  identifiers: EntityPath;
  entityProgressions: EntityProgression[];
  queryClient: QueryClient;
  isFromNotification?: boolean;
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

  // ONLY validate assignments for notification taps (M2-8698)
  // Use same logic as ActivityGroupsBuildManager for consistency
  if (isFromNotification) {
    const appletDto = queryUtils.getAppletDto(appletId);
    const assignments = queryUtils.getAssignmentsDto(appletId);

    if (!appletDto) {
      logger.warn(
        '[checkEntityAvailability] Check done: false (applet data not found)',
      );
      callback(false);
      return;
    }

    const entity =
      entityType === 'flow'
        ? appletDto.activityFlows.find(f => f.id === entityId)
        : appletDto.activities.find(a => a.id === entityId);

    if (!entity) {
      logger.warn(
        '[checkEntityAvailability] Check done: false (entity not found in applet)',
      );
      callback(false);
      return;
    }

    logger.log(
      `[checkEntityAvailability] Validating assignment for entity: ${entityName}, autoAssign: ${entity.autoAssign}`,
    );

    // Auto-assigned activities are always accessible (matches ActivityGroupsBuildManager logic line 198)
    if (entity.autoAssign) {
      logger.log(
        '[checkEntityAvailability] Auto-assigned entity, skipping assignment validation',
      );

      // For auto-assigned activities, skip full availability checks and allow if not completed
      // This matches activity list behavior where auto-assigned activities are always shown
      const isCompleted = isProgressionCompletedToday(progression);
      logger.log(
        `[checkEntityAvailability] Auto-assigned activity check: isCompleted=${isCompleted}`,
      );

      if (!isCompleted) {
        logger.log(
          '[checkEntityAvailability] Check done: true (auto-assigned and not completed)',
        );
        callback(true);
        return;
      }
      // If completed, continue to completion check below
    } else {
      // Manually assigned - verify user has assignment (matches ActivityGroupsBuildManager logic line 202-223)
      if (!assignments) {
        logger.log(
          '[checkEntityAvailability] Check done: false (no assignments data for manually assigned entity)',
        );
        showNotAssignedToast(entityName);
        callback(false);
        return;
      }

      const currentUserId = selectUserId(reduxStore.getState());
      const normalizedAssignments = mapAssignmentsFromDto(assignments);

      const hasAssignment = normalizedAssignments.some(assignment => {
        const matchesEntity =
          entityType === 'flow'
            ? assignment.__type === 'activityFlow' &&
              assignment.activityFlowId === entityId
            : assignment.__type === 'activity' &&
              assignment.activityId === entityId;

        if (!matchesEntity) return false;

        const { respondent, target } = assignment;
        if (!respondent || !target) return false;

        // Match user - if both IDs exist, they must match
        if (
          respondent.userId &&
          currentUserId &&
          respondent.userId !== currentUserId
        ) {
          return false;
        }

        // For self-reports (no targetSubjectId), check if it's a self-assignment
        if (!targetSubjectId) {
          return respondent.id === target.id;
        }

        // For assessments of others, check if target matches
        return target.id === targetSubjectId;
      });

      if (!hasAssignment) {
        logger.log(
          '[checkEntityAvailability] Check done: false (no assignment found for current user)',
        );
        showNotAssignedToast(entityName);
        callback(false);
        return;
      }

      logger.log('[checkEntityAvailability] Assignment validation passed');
    }
  }

  const eventDto = queryUtils.getEventDto(appletId, eventId);

  if (!eventDto) {
    logger.warn(
      `[checkEntityAvailability] Check done: false (event not found) eventId="${eventId}"`,
    );
    onActivityNotAvailable(entityName, () => callback(false));
    return;
  }

  const event = mapEventFromDto(eventDto);
  event.scheduledAt = getDefaultScheduledDateCalculator().calculate(event);

  logger.log(
    `[checkEntityAvailability] Event found: eventId="${eventId}", scheduledAt="${event.scheduledAt}", targetSubjectId="${targetSubjectId || 'NULL'}"`,
  );

  if (!event.scheduledAt) {
    logger.warn(
      '[checkEntityAvailability] Check done: false (scheduledAt calculation failed)',
    );
    onActivityNotAvailable(entityName, () => callback(false));
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

  logger.log(
    `[checkEntityAvailability] Availability checks: isAvailable=${isAvailable}, isScheduled=${isScheduled}`,
  );

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

import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

import { StoreProgress } from '@app/abstract/lib';
import { ActivityListItem } from '@app/entities/activity';
import { AppletModel, clearStorageRecords } from '@app/entities/applet';
import {
  LocalEventDetail,
  LocalInitialNotification,
  LocalNotificationType,
  NotificationModel,
  useBackgroundEvents,
  useForegroundEvent,
  useOnInitialAndroidNotification,
} from '@app/entities/notification';
import { LogTrigger } from '@app/shared/api';
import { useAppSelector } from '@app/shared/lib';
import {
  ActivityGroupType,
  ActivityListGroup,
} from '@app/widgets/activity-group';
import { ActivityGroupsBuildManager } from '@app/widgets/activity-group/model/services';

import { onActivityNotFound, onScheduledToday } from '../../lib';

export function useOnNotificationTap() {
  const queryClient = useQueryClient();

  const { navigate } = useNavigation();

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const { startFlow, startActivity } = AppletModel.useStartEntity();

  const actions: Record<
    LocalNotificationType,
    (eventDetail: LocalEventDetail) => void
  > = {
    'request-to-reschedule-due-to-limit': () => {
      NotificationModel.NotificationRefreshService.refresh(
        queryClient,
        storeProgress,
        LogTrigger.LimitReachedNotification,
      );
    },
    'schedule-event-alert': eventDetail => {
      const { appletId, activityId, activityFlowId, eventId } =
        eventDetail.notification.data;

      startActivityOrFlow(
        appletId!,
        activityId ?? null,
        activityFlowId ?? null,
        eventId!,
      );
    },
  };

  function navigateSurvey(
    appletId: string,
    activityId: string,
    eventId: string,
    flowId?: string,
  ) {
    navigate('InProgressActivity', {
      appletId,
      activityId,
      eventId,
      flowId,
    });
  }

  const checkAvailability = (
    appletId: string,
    activityId: string | null,
    flowId: string | null,
    eventId: string,
  ) => {
    const groupsResult = ActivityGroupsBuildManager.process(
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
        flowId
          ? scheduled.activityFlowDetails!.activityFlowName
          : scheduled.name,
        scheduled.availableFrom!,
      );
      return false;
    }

    onActivityNotFound();

    return false;
  };

  const startActivityOrFlow = (
    appletId: string,
    activityId: string | null,
    flowId: string | null,
    eventId: string,
  ) => {
    if (!checkAvailability(appletId, activityId, flowId, eventId)) {
      return;
    }

    if (flowId) {
      startFlow(appletId, flowId, eventId).then(
        ({ startedFromActivity, startedFromScratch }) => {
          if (startedFromScratch) {
            clearStorageRecords.byEventId(eventId);
          }

          navigateSurvey(appletId, startedFromActivity, eventId, flowId);
        },
      );
    } else {
      startActivity(appletId, activityId!, eventId).then(startedFromScratch => {
        if (startedFromScratch) {
          clearStorageRecords.byEventId(eventId);
        }

        navigateSurvey(appletId, activityId!, eventId);
      });
    }
  };

  useForegroundEvent({
    onPress: (eventDetail: LocalEventDetail) => {
      const action = actions[eventDetail.notification.data.type];

      action?.(eventDetail);
    },
  });

  useBackgroundEvents({
    onPress: (eventDetail: LocalEventDetail) => {
      const action = actions[eventDetail.notification.data.type];

      action?.(eventDetail);
    },
  });

  useOnInitialAndroidNotification(
    (initialNotification: LocalInitialNotification) => {
      const action = actions[initialNotification.notification.data.type];

      action?.(initialNotification);
    },
  );
}

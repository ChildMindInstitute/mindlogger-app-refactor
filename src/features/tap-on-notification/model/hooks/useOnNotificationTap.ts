import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

import { StoreProgress } from '@app/abstract/lib';
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
import { useAppSelector } from '@app/shared/lib';

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

  const startActivityOrFlow = (
    appletId: string,
    activityId: string | null,
    flowId: string | null,
    eventId: string,
  ) => {
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

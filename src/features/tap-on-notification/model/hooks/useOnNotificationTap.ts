import { useQueryClient } from '@tanstack/react-query';

import { StoreProgress } from '@app/abstract/lib';
import { AppletModel } from '@app/entities/applet';
import {
  LocalEventDetail,
  LocalNotificationType,
  NotificationModel,
  useBackgroundEvents,
  useForegroundEvent,
  useOnInitialAndroidNotification,
} from '@app/entities/notification';
import { useAppSelector } from '@app/shared/lib';

export function useOnNotificationTap() {
  const queryClient = useQueryClient();

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

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
      console.log('schedule-event-alert', eventDetail);
    },
  };

  useForegroundEvent({
    onPress: eventDetail => {
      console.log('useForegroundEvent');

      const action = actions[eventDetail.notification.data.type];

      action?.(eventDetail);
    },
  });

  useBackgroundEvents({
    onPress: eventDetail => {
      console.log('useBackgroundEvents');

      const action = actions[eventDetail.notification.data.type];

      action?.(eventDetail);
    },
  });

  useOnInitialAndroidNotification(initialNotification => {
    console.log('useOnInitialAndroidNotification');

    const action = actions[initialNotification.notification.data.type];

    action?.(initialNotification);
  });
}

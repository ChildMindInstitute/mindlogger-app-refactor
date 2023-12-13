import { useEffect } from 'react';
import { AppState } from 'react-native';

import { NotificationManager } from '@entities/notification/model';
import { useInterval } from '@shared/lib';

const CHECK_INTERVAL = 20;

export const useInProgressScreenNotifications = (
  eventId: string,
  entityId: string,
) => {
  const isForeground = AppState.currentState === 'active';

  const { start: startInterval, stop: stopInterval } = useInterval(() => {
    NotificationManager.cancelUpcomingNotificationsForInProgressActivity(
      eventId,
      entityId,
      CHECK_INTERVAL,
      isForeground,
    );
  }, CHECK_INTERVAL * 1000);

  useEffect(() => {
    NotificationManager.cancelUpcomingNotificationsForInProgressActivity(
      eventId,
      entityId,
      CHECK_INTERVAL,
      isForeground,
    );
    startInterval();

    return () => stopInterval();
  }, [startInterval, stopInterval, eventId, entityId, isForeground]);
};

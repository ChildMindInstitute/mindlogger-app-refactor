import { useEffect } from 'react';
import { AppState } from 'react-native';

import { NotificationManager } from '@entities/notification/model';
import { useInterval } from '@shared/lib';

const CHECK_INTERVAL = 20;

export const useUpcomingNotificationsObserver = (
  eventId: string,
  entityId: string,
) => {
  const isForeground = AppState.currentState === 'active';

  const { start: startInterval, stop: stopInterval } = useInterval(() => {
    if (isForeground) {
      NotificationManager.cancelNotificationsForEventEntityInTimeInterval(
        eventId,
        entityId,
        { from: Date.now(), to: CHECK_INTERVAL },
      );
    }
  }, CHECK_INTERVAL * 1000);

  useEffect(() => {
    startInterval();

    return stopInterval;
  }, [startInterval, stopInterval, isForeground]);
};

import { useEffect } from 'react';
import { AppState } from 'react-native';

import { NotificationManager } from '@entities/notification/model';
import { useInterval } from '@shared/lib';

const CHECK_INTERVAL = 20000;

export const useUpcomingNotificationsObserver = (
  eventId: string,
  entityId: string,
  targetSubjectId: string | null,
) => {
  const isForeground = AppState.currentState === 'active';

  const { start: startInterval, stop: stopInterval } = useInterval(() => {
    if (isForeground) {
      NotificationManager.cancelNotificationsForEventEntityInTimeInterval(
        entityId,
        eventId,
        targetSubjectId,
        { from: Date.now(), to: Date.now() + CHECK_INTERVAL },
      ).catch(console.error);
    }
  }, CHECK_INTERVAL);

  useEffect(() => {
    startInterval();

    return stopInterval;
  }, [startInterval, stopInterval, isForeground]);
};

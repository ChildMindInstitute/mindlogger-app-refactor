import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useInterval } from '@app/shared/lib/timers/hooks/useInterval';

import { getDefaultNotificationManager } from '../../model/notificationManagerInstance';

const CHECK_INTERVAL = 20000;

export const useUpcomingNotificationsObserver = (
  eventId: string,
  entityId: string,
  targetSubjectId: string | null,
) => {
  const isForeground = AppState.currentState === 'active';

  const { start: startInterval, stop: stopInterval } = useInterval(() => {
    if (isForeground) {
      getDefaultNotificationManager()
        .cancelNotificationsForEventEntityInTimeInterval(
          entityId,
          eventId,
          targetSubjectId,
          { from: Date.now(), to: Date.now() + CHECK_INTERVAL },
        )
        .catch(console.error);
    }
  }, CHECK_INTERVAL);

  useEffect(() => {
    startInterval();

    return stopInterval;
  }, [startInterval, stopInterval, isForeground]);
};

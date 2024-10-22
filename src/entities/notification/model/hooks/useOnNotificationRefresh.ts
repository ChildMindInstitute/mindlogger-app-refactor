import { useCallback, useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  selectAppletsEntityProgressions,
  selectEntityResponseTimes,
} from '@app/entities/applet/model/selectors';
import { LogTrigger } from '@app/shared/api/services/INotificationService';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { getDefaultNotificationRefreshService } from '../notificationRefreshServiceInstance';

export function useOnNotificationRefresh(callback?: () => void) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const queryClient = useQueryClient();

  const progressions = useAppSelector(selectAppletsEntityProgressions);

  const responseTimes = useAppSelector(selectEntityResponseTimes);

  const refreshNotifications = useCallback(
    (logTrigger: LogTrigger | undefined) => {
      getDefaultNotificationRefreshService()
        .refresh(queryClient, progressions, responseTimes, logTrigger!)
        .finally(() => {
          getDefaultLogger().send();

          if (callbackRef.current) {
            callbackRef.current();
          }
        });
    },
    [queryClient, progressions, responseTimes],
  );

  useEffect(() => {
    Emitter.on('on-notification-refresh', refreshNotifications);

    return () => {
      Emitter.off('on-notification-refresh', refreshNotifications);
    };
  }, [refreshNotifications]);
}

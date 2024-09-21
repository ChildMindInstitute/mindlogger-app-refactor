import { useCallback, useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { AppletModel } from '@app/entities/applet';
import { LogTrigger } from '@app/shared/api';
import { Emitter, Logger, useAppSelector } from '@shared/lib';

import { NotificationModel } from '../..';

function useOnNotificationRefresh(callback?: () => void) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const queryClient = useQueryClient();

  const progressions = useAppSelector(
    AppletModel.selectors.selectAppletsEntityProgressions,
  );

  const responseTimes = useAppSelector(
    AppletModel.selectors.selectEntityResponseTimes,
  );

  const refreshNotifications = useCallback(
    (logTrigger: LogTrigger | undefined) => {
      NotificationModel.NotificationRefreshService.refresh(
        queryClient,
        progressions,
        responseTimes,
        logTrigger!,
      ).finally(() => {
        Logger.send();

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

export default useOnNotificationRefresh;

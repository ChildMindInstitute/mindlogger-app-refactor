import { useCallback, useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { StoreProgress } from '@app/abstract/lib';
import { AppletModel } from '@app/entities/applet';
import { LogTrigger } from '@app/shared/api';
import { Emitter, Logger, useAppSelector } from '@shared/lib';

import { NotificationModel } from '../..';

function useOnNotificationRefresh(callback?: () => void) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const queryClient = useQueryClient();

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const completions = useAppSelector(AppletModel.selectors.selectCompletions);

  const refreshNotifications = useCallback(
    (logTrigger: LogTrigger | undefined) => {
      NotificationModel.NotificationRefreshService.refresh(
        queryClient,
        storeProgress,
        completions,
        logTrigger!,
      )
        .finally(() => {
          Logger.send();
        })
        .finally(() => {
          if (callbackRef.current) {
            callbackRef.current();
          }
        });
    },
    [queryClient, completions, storeProgress],
  );

  useEffect(() => {
    Emitter.on('on-notification-refresh', refreshNotifications);

    return () => {
      Emitter.off('on-notification-refresh', refreshNotifications);
    };
  }, [refreshNotifications]);
}

export default useOnNotificationRefresh;

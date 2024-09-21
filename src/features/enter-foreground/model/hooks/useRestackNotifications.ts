import { useIsRestoring, useQueryClient } from '@tanstack/react-query';

import { AppletModel } from '@app/entities/applet';
import { NotificationModel } from '@app/entities/notification';
import { SessionModel } from '@app/entities/session';
import { LogTrigger } from '@app/shared/api';
import { Logger, useAppSelector, useOnForeground } from '@app/shared/lib';

function useRestackNotifications(hasExpiredEntity: () => boolean) {
  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();
  const hasSession = SessionModel.useHasSession();

  const progressions = useAppSelector(
    AppletModel.selectors.selectAppletsEntityProgressions,
  );

  const responseTimes = useAppSelector(
    AppletModel.selectors.selectEntityResponseTimes,
  );

  useOnForeground(
    () => {
      if (hasExpiredEntity()) {
        Logger.log(
          '[useRestackNotifications]: Cancelled due to hasExpiredEntity',
        );
        return;
      }

      NotificationModel.NotificationRefreshService.refresh(
        queryClient,
        progressions,
        responseTimes,
        LogTrigger.GoToForeground,
      ).catch(console.error);
    },
    { enabled: !isRestoring && hasSession },
  );
}

export default useRestackNotifications;

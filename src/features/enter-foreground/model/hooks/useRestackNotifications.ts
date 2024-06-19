import { useIsRestoring, useQueryClient } from '@tanstack/react-query';

import { StoreProgress } from '@app/abstract/lib';
import { AppletModel } from '@app/entities/applet';
import { NotificationModel } from '@app/entities/notification';
import { SessionModel } from '@app/entities/session';
import { LogTrigger } from '@app/shared/api';
import { Logger, useAppSelector, useOnForeground } from '@app/shared/lib';

function useRestackNotifications(hasExpiredEntity: () => boolean) {
  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();
  const hasSession = SessionModel.useHasSession();

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const completions = useAppSelector(AppletModel.selectors.selectCompletions);

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
        storeProgress,
        completions,
        LogTrigger.GoToForeground,
      );
    },
    { enabled: !isRestoring && hasSession },
  );
}

export default useRestackNotifications;

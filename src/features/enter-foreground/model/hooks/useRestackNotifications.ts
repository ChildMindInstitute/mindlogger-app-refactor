import { useIsRestoring, useQueryClient } from '@tanstack/react-query';

import { StoreProgress } from '@app/abstract/lib';
import { AppletModel } from '@app/entities/applet';
import { NotificationModel } from '@app/entities/notification';
import { SessionModel } from '@app/entities/session';
import { LogTrigger } from '@app/shared/api';
import { useAppSelector, useOnForeground } from '@app/shared/lib';

function useRestackNotifications() {
  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();
  const hasSession = SessionModel.useHasSession();

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  useOnForeground(
    () => {
      NotificationModel.NotificationRefreshService.refresh(
        queryClient,
        storeProgress,
        LogTrigger.GoToForeground,
      );
    },
    { enabled: !isRestoring && hasSession },
  );
}

export default useRestackNotifications;

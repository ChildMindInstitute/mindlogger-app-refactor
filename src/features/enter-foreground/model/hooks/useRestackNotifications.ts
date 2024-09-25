import { useIsRestoring, useQueryClient } from '@tanstack/react-query';

import {
  selectAppletsEntityProgressions,
  selectEntityResponseTimes,
} from '@app/entities/applet/model/selectors';
import { getDefaultNotificationRefreshService } from '@app/entities/notification/model/notificationRefreshServiceInstance';
import { useHasSession } from '@app/entities/session/model/hooks/useHasSession';
import { LogTrigger } from '@app/shared/api/services/INotificationService';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { useOnForeground } from '@app/shared/lib/hooks/useOnForeground';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

export function useRestackNotifications(hasExpiredEntity: () => boolean) {
  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();
  const hasSession = useHasSession();

  const progressions = useAppSelector(selectAppletsEntityProgressions);

  const responseTimes = useAppSelector(selectEntityResponseTimes);

  useOnForeground(
    () => {
      if (hasExpiredEntity()) {
        getDefaultLogger().log(
          '[useRestackNotifications]: Cancelled due to hasExpiredEntity',
        );
        return;
      }

      getDefaultNotificationRefreshService()
        .refresh(
          queryClient,
          progressions,
          responseTimes,
          LogTrigger.GoToForeground,
        )
        .catch(console.error);
    },
    { enabled: !isRestoring && hasSession },
  );
}

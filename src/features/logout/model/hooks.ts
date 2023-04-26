import { CacheManager } from '@georstat/react-native-image-cache';
import { useQueryClient } from '@tanstack/react-query';

import { onBeforeLogout } from '@app/entities/identity/lib/alerts';
import { NotificationModel } from '@app/entities/notification';
import { IdentityService } from '@app/shared/api';
import { IdentityModel } from '@entities/identity';
import { SessionModel } from '@entities/session';
import { hasPendingMutations, isAppOnline, useAppDispatch } from '@shared/lib';

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const processLogout = async () => {
    dispatch(IdentityModel.actions.onLogout());

    SessionModel.clearSession();

    CacheManager.clearCache();

    await queryClient.removeQueries(['applets']);
    await queryClient.removeQueries(['events']);
    await queryClient.removeQueries(['activities']);

    queryClient.clear();

    IdentityService.logout({
      deviceId: 123, // todo - provide real fcm token
    });

    NotificationModel.NotificationManager.clearScheduledNotifications();
  };

  const logout = async () => {
    const isOnline = await isAppOnline();

    if (hasPendingMutations(queryClient)) {
      onBeforeLogout({
        isOnline,
        onCancel: null,
        onLogout: processLogout,
      });
    } else {
      processLogout();
    }
  };

  return { logout, forceLogout: processLogout };
}

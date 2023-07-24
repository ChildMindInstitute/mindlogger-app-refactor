import { CacheManager } from '@georstat/react-native-image-cache';
import { useQueryClient } from '@tanstack/react-query';

import { onBeforeLogout } from '@app/entities/identity/lib/alerts';
import { NotificationModel } from '@app/entities/notification';
import { IdentityService } from '@app/shared/api';
import { SystemRecord } from '@app/shared/lib/records';
import { IdentityModel } from '@entities/identity';
import { UserInfoRecord, UserPrivateKeyRecord } from '@entities/identity/lib';
import { SessionModel } from '@entities/session';
import { hasPendingMutations, isAppOnline, useAppDispatch } from '@shared/lib';

import { clearEntityRecordStorages } from '../lib';

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const processLogout = async () => {
    try {
      IdentityService.logout({
        deviceId: SystemRecord.getDeviceId()!,
      });
    } catch (error) {
      console.log('Logout operation failed:', error);
    }

    SessionModel.clearSession();

    dispatch(IdentityModel.actions.onLogout());

    CacheManager.clearCache();

    clearEntityRecordStorages();

    NotificationModel.NotificationManager.clearScheduledNotifications();

    UserInfoRecord.clear();
    UserPrivateKeyRecord.clear();

    await queryClient.removeQueries(['applets']);
    await queryClient.removeQueries(['events']);
    await queryClient.removeQueries(['activities']);

    queryClient.clear();
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

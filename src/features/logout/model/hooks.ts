import { CacheManager } from '@georstat/react-native-image-cache';
import { useQueryClient } from '@tanstack/react-query';

import AnswersQueueService from '@app/entities/activity/lib/services/AnswersQueueService';
import { onBeforeLogout } from '@app/entities/identity/lib/alerts';
import { NotificationModel } from '@app/entities/notification';
import { IdentityService } from '@app/shared/api';
import { SystemRecord } from '@app/shared/lib/records';
import { IdentityModel } from '@entities/identity';
import { UserInfoRecord, UserPrivateKeyRecord } from '@entities/identity/lib';
import { SessionModel } from '@entities/session';
import {
  Logger,
  hasPendingMutations,
  isAppOnline,
  useAppDispatch,
  AnalyticsService,
  useTCPSocket,
} from '@shared/lib';

import { clearEntityRecordStorages, clearUploadQueueStorage } from '../lib';

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { closeConnection: closeActiveTCPConnection } = useTCPSocket();

  const processLogout = async () => {
    Logger.info('[useLogout.processLogout]: Processing logout');

    await Logger.send();

    try {
      IdentityService.logout({
        deviceId: SystemRecord.getDeviceId()!,
      });
    } catch (error) {
      console.warn(
        `[useLogout.processLogout]: Logout operation failed: ${error}`,
      );
    }

    AnalyticsService.logout();

    dispatch(IdentityModel.actions.onLogout());

    CacheManager.clearCache();

    clearEntityRecordStorages();

    clearUploadQueueStorage();

    NotificationModel.NotificationManager.clearScheduledNotifications();

    UserInfoRecord.clear();
    UserPrivateKeyRecord.clear();

    Logger.clearAllLogFiles();

    await queryClient.removeQueries(['applets']);
    await queryClient.removeQueries(['events']);
    await queryClient.removeQueries(['activities']);

    queryClient.clear();

    SessionModel.clearSession();

    closeActiveTCPConnection();
  };

  const logout = async () => {
    const isOnline = await isAppOnline();

    if (hasPendingMutations(queryClient) || AnswersQueueService.getLength()) {
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

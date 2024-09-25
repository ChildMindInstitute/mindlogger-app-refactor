import { CacheManager } from '@georstat/react-native-image-cache';
import { useQueryClient } from '@tanstack/react-query';

import { getDefaultAnswersQueueService } from '@app/entities/activity/lib/services/answersQueueServiceInstance';
import { onBeforeLogout } from '@app/entities/identity/lib/alerts';
import { getDefaultUserInfoRecord } from '@app/entities/identity/lib/userInfoRecord';
import { getDefaultUserPrivateKeyRecord } from '@app/entities/identity/lib/userPrivateKeyRecordInstance';
import { getDefaultNotificationManager } from '@app/entities/notification/model/notificationManagerInstance';
import { getDefaultSessionService } from '@app/entities/session/lib/sessionServiceInstance';
import { getDefaultIdentityService } from '@app/shared/api/services/identityServiceInstance';
import { AnalyticsService } from '@app/shared/lib/analytics/AnalyticsService';
import { FeatureFlagsService } from '@app/shared/lib/featureFlags/FeatureFlagsService';
import { getDefaultSystemRecord } from '@app/shared/lib/records/systemRecordInstance';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { useTCPSocket } from '@app/shared/lib/tcp/useTCPSocket';
import { isAppOnline } from '@app/shared/lib/utils/networkHelpers';
import { hasPendingMutations } from '@app/shared/lib/utils/reactQueryHelpers';

export function useLogout() {
  const queryClient = useQueryClient();
  const { closeConnection: closeActiveTCPConnection } = useTCPSocket();

  const processLogout = async () => {
    getDefaultLogger().info('[useLogout.processLogout]: Processing logout');

    Emitter.emit('logout');

    await getDefaultLogger().send();

    try {
      getDefaultIdentityService().logout({
        deviceId: getDefaultSystemRecord().getDeviceId()!,
      });
    } catch (error) {
      console.warn(
        `[useLogout.processLogout]: Logout operation failed: ${error}`,
      );
    }

    AnalyticsService.logout();

    FeatureFlagsService.logout();

    CacheManager.clearCache();

    getDefaultNotificationManager().clearScheduledNotifications();

    getDefaultUserInfoRecord().clear();
    getDefaultUserPrivateKeyRecord().clear();

    getDefaultLogger().clearAllLogFiles();

    await queryClient.removeQueries(['applets']);
    await queryClient.removeQueries(['events']);
    await queryClient.removeQueries(['activities']);

    queryClient.clear();

    getDefaultSessionService().clearSession();

    closeActiveTCPConnection();
  };

  const logout = async () => {
    const isOnline = await isAppOnline();

    if (
      hasPendingMutations(queryClient) ||
      getDefaultAnswersQueueService().getLength()
    ) {
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

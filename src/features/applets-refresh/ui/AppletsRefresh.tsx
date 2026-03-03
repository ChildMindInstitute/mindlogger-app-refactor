import { FC } from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';

import {
  selectAppletsEntityProgressions,
  selectEntityResponseTimes,
} from '@app/entities/applet/model/selectors';
import { TargetedProgressSyncService } from '@app/entities/applet/model/services/TargetedProgressSyncService';
import { getDefaultNotificationRefreshService } from '@app/entities/notification/model/notificationRefreshServiceInstance';
import { LogTrigger } from '@app/shared/api/services/INotificationService';
import { isFlowResumeEnabled } from '@app/shared/lib/featureFlags/isFlowResumeEnabled';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { useRefresh } from '../model/hooks/useRefresh';

type Props = Omit<RefreshControlProps, 'refreshing' | 'onRefresh'> & {
  appletId?: string;
};

export const AppletsRefresh: FC<Props> = ({ appletId, ...props }) => {
  const queryClient = useQueryClient();

  const progressions = useAppSelector(selectAppletsEntityProgressions);

  const responseTimes = useAppSelector(selectEntityResponseTimes);

  const { refresh, isRefreshing } = useRefresh(async () => {
    // If appletId is provided and cross-device sync is enabled for this applet, sync it first
    if (appletId && isFlowResumeEnabled(appletId)) {
      const syncService = new TargetedProgressSyncService(
        {} as any, // state not needed for sync
        (() => {}) as any, // dispatch not needed for sync
        getDefaultLogger(),
        queryClient,
      );
      await syncService.syncAppletProgress(appletId);
    }

    // Then reschedule notifications
    await getDefaultNotificationRefreshService().refresh(
      queryClient,
      progressions,
      responseTimes,
      LogTrigger.PullToRefresh,
    );
    getDefaultLogger().send().catch(console.error);
  });

  return (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={refresh}
      tintColor="black"
      // Don't change. See https://github.com/facebook/react-native/issues/32144
      {...props}
    />
  );
};

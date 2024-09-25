import { FC } from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';

import {
  selectAppletsEntityProgressions,
  selectEntityResponseTimes,
} from '@app/entities/applet/model/selectors';
import { getDefaultNotificationRefreshService } from '@app/entities/notification/model/notificationRefreshServiceInstance';
import { LogTrigger } from '@app/shared/api/services/INotificationService';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { useRefresh } from '../model/hooks/useRefresh';

type Props = Omit<RefreshControlProps, 'refreshing' | 'onRefresh'>;

export const AppletsRefresh: FC<Props> = props => {
  const queryClient = useQueryClient();

  const progressions = useAppSelector(selectAppletsEntityProgressions);

  const responseTimes = useAppSelector(selectEntityResponseTimes);

  const { refresh, isRefreshing } = useRefresh(async () => {
    await getDefaultNotificationRefreshService().refresh(
      queryClient,
      progressions,
      responseTimes,
      LogTrigger.PullToRefresh,
    );
    getDefaultLogger()
      .send()
      .catch(err => getDefaultLogger().error(err as never));
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

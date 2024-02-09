import { FC } from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';

import { StoreProgress } from '@app/abstract/lib';
import { AppletModel } from '@app/entities/applet';
import { NotificationModel } from '@app/entities/notification';
import { LogTrigger } from '@app/shared/api';
import { Logger, useAppSelector } from '@app/shared/lib';

import { useRefresh } from '../model';

type Props = Omit<RefreshControlProps, 'refreshing' | 'onRefresh'>;

const AppletsRefresh: FC<Props> = (props) => {
  const queryClient = useQueryClient();

  const storeProgress: StoreProgress = useAppSelector(AppletModel.selectors.selectInProgressApplets);

  const completions = useAppSelector(AppletModel.selectors.selectCompletions);

  const { refresh, isRefreshing } = useRefresh(async () => {
    await NotificationModel.NotificationRefreshService.refresh(
      queryClient,
      storeProgress,
      completions,
      LogTrigger.PullToRefresh,
    );
    Logger.send();
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

export default AppletsRefresh;

import { FC, useEffect, useState } from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';

import { StoreProgress } from '@app/abstract/lib';
import { AppletModel } from '@app/entities/applet';
import { NotificationModel } from '@app/entities/notification';
import { LogTrigger } from '@app/shared/api';
import { useAppSelector } from '@app/shared/lib';

import { useRefresh } from '../model';

type Props = Omit<RefreshControlProps, 'refreshing' | 'onRefresh'>;

const AppletsRefresh: FC<Props> = props => {
  const queryClient = useQueryClient();
  const [appletsRefreshing, setAppletsRefreshing] = useState(false);

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const { refresh, isRefreshing } = useRefresh(() => {
    NotificationModel.NotificationRefreshService.refresh(
      queryClient,
      storeProgress,
      LogTrigger.PullToRefresh,
    );
  });

  useEffect(() => {
    setAppletsRefreshing(isRefreshing);
  }, [isRefreshing]);

  return (
    <RefreshControl
      refreshing={appletsRefreshing}
      onRefresh={refresh}
      // Don't change. See https://github.com/facebook/react-native/issues/32144
      {...props}
    />
  );
};

export default AppletsRefresh;

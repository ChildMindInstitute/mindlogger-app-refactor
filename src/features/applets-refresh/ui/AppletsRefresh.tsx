import { FC, useEffect } from 'react';
import { RefreshControl } from 'react-native';

import { useIsFetching, useQueryClient } from '@tanstack/react-query';

import { useAppDispatch, useAppSelector } from '@app/shared/lib';
import { AppletsRefreshModel } from '@entities/applet';

const AppletsRefresh: FC = () => {
  const client = useQueryClient();

  const dispatch = useAppDispatch();

  const refreshingByPullToRefresh = useAppSelector(
    AppletsRefreshModel.selectors.selectRefreshingByPullToRefresh,
  );

  const isFetching = useIsFetching(['applets']) === 1;

  useEffect(() => {
    if (!isFetching && refreshingByPullToRefresh) {
      dispatch(AppletsRefreshModel.actions.onPullToRefresh(false));
    }
  }, [refreshingByPullToRefresh, isFetching, dispatch]);

  return (
    <RefreshControl
      refreshing={isFetching && refreshingByPullToRefresh}
      onRefresh={() => {
        dispatch(AppletsRefreshModel.actions.onPullToRefresh(true));
        client.invalidateQueries(['applets']);
      }}
    />
  );
};

export default AppletsRefresh;

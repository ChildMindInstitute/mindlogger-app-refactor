import { useState } from 'react';

import { AppletModel } from '@entities/applet';

import useRefreshResumeOnAppState from './useRefreshResumeOnAppState';

function useRefresh(onSuccess: () => void) {
  const { mutateAsync: refresh } = AppletModel.useRefreshMutation(onSuccess);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useRefreshResumeOnAppState(isRefreshing, setIsRefreshing);

  const onRefresh = () => {
    refresh().then(() => setIsRefreshing(false));
    setIsRefreshing(true);
  };

  return {
    refresh: onRefresh,
    isRefreshing,
  };
}

export default useRefresh;

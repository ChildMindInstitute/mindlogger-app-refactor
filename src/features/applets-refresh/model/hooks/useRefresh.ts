import { useEffect, useState } from 'react';

import useRefreshMutation from './useRefreshMutation';

function useRefresh(onSuccess: () => void) {
  const { isLoading: isRefreshLoading, mutate: refresh } =
    useRefreshMutation(onSuccess);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    refresh();
    setIsRefreshing(true);
  };

  useEffect(() => {
    if (!isRefreshLoading) {
      setIsRefreshing(false);
    }
  }, [isRefreshLoading]);

  return {
    refresh: onRefresh,
    isRefreshing,
  };
}

export default useRefresh;

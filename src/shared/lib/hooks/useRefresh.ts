import { useEffect, useState } from 'react';

import { useRefreshMutation } from './useRefreshMutation';

function useRefresh() {
  const { isLoading: isRefreshLoading, mutate: refresh } = useRefreshMutation();

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

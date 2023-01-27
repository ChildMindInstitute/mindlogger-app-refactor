import { useState, useLayoutEffect, useEffect } from 'react';

import { useQueryClient, useIsFetching, QueryKey } from '@tanstack/react-query';

const IOS_DELAY_TO_SHOW_REFRESH = 60;

function useRefreshQuery(queryKey: QueryKey) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isFetching = useIsFetching(queryKey) !== 0;

  const refresh = () => {
    queryClient.invalidateQueries(queryKey);
    setIsRefreshing(true);
  };

  useLayoutEffect(() => {
    if (isRefreshing && !isFetching) {
      setIsRefreshing(false);
    }
  }, [isFetching, isRefreshing]);

  useEffect(() => {
    if (isFetching && !isRefreshing) {
      setTimeout(() => {
        setIsRefreshing(true);
      }, IOS_DELAY_TO_SHOW_REFRESH);
    }
  }, [isFetching, isRefreshing]);

  return {
    refresh,
    isRefreshing,
  };
}

export default useRefreshQuery;

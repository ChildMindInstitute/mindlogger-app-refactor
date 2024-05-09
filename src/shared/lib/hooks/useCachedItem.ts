import { useMemo } from 'react';

import { QueryKey, useQueryClient } from '@tanstack/react-query';

import { getDataFromQuery } from '../utils';

const useCachedItem = <TResponse>(key: QueryKey) => {
  const queryClient = useQueryClient();

  const response = useMemo(() => {
    return getDataFromQuery<TResponse>(key, queryClient);
  }, [queryClient, key]);

  return response;
};

export default useCachedItem;

import { QueryClient, QueryKey, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { AppletsResponse } from '@app/shared/api';

const getDataFromQuery = <TResponse>(
  key: QueryKey,
  queryClient: QueryClient,
): TResponse | null => {
  const data: Array<[QueryKey, AxiosResponse<TResponse> | undefined]> =
    queryClient.getQueriesData({ queryKey: key, exact: true });

  if (!data?.length || !data[0][1]) {
    return null;
  }
  return data[0][1].data;
};

const useCacheHasData = () => {
  const queryClient = useQueryClient();
  return {
    check: (key: QueryKey = ['applets']): boolean => {
      const response = getDataFromQuery<AppletsResponse>(key, queryClient);
      return !!response?.result.length;
    },
  };
};

export default useCacheHasData;

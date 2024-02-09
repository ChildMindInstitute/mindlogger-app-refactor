import { QueryFunction, UseQueryOptions, useQuery } from '@tanstack/react-query';

import { BaseError } from '../types';

type QueryKey = [string, Record<string, unknown>?];

const useBaseQuery = <TQueryFnData, TError = BaseError, TData = TQueryFnData>(
  key: QueryKey,
  queryFn: QueryFunction<TQueryFnData, QueryKey>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery(key, queryFn, {
    ...options,
    onError: (error: BaseError) => {
      const errorRecords = error.response?.data?.result;

      if (errorRecords?.length) {
        const firstRecord = errorRecords[0];

        error.evaluatedMessage = firstRecord.message;
      } else {
        error.evaluatedMessage = error.message;
      }

      if (options?.onError) {
        options?.onError(error as unknown as TError);
      }
    },
  } as unknown as typeof options);
};

export default useBaseQuery;

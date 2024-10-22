import { UseQueryOptions, useQueries } from '@tanstack/react-query';

import { BaseError } from '../types';

type QueryKey = [string, Record<string, unknown>?];

export const useBaseQueries = <
  TQueryFnData,
  TError = BaseError,
  TData = TQueryFnData,
>(
  queries: Array<UseQueryOptions<TQueryFnData, TError, TData, QueryKey>>,
) => {
  return useQueries({
    queries,
  });
};

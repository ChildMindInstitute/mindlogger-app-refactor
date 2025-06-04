import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

type ErrorResponse = {
  data: { success: boolean; message: string };
  status: number;
};

type OneUpHealthError = {
  message?: string;
  response: ErrorResponse;
  code: string;
  evaluatedMessage?: string;
};

export const useOneUpHealthBaseQuery = <TQueryFnData, TData = TQueryFnData>(
  key: QueryKey,
  queryFn: QueryFunction<TQueryFnData, QueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, OneUpHealthError, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery(key, queryFn, {
    ...options,
    onError: (error: OneUpHealthError) => {
      error.message = error.response?.data?.message ?? error.message;
    },
  });
};

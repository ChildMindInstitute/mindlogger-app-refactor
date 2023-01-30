import {
  QueryFunction,
  UseQueryOptions,
  useQuery,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { DEFAULT_LANGUAGE, Language } from '@app/shared/lib';

import { BaseError } from '../types';

type QueryKey = [string, Record<string, unknown>?];

const useBaseQuery = <
  TQueryKey extends QueryKey,
  TQueryFnData,
  TError = BaseError,
  TData = TQueryFnData,
>(
  key: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >,
) => {
  const { i18n } = useTranslation();

  return useQuery(key, queryFn, {
    ...options,
    onError: (error: BaseError) => {
      const errorRecords = error.response?.data?.results;

      if (errorRecords?.length) {
        const firstRecord = errorRecords[0];

        const currentLanguage = i18n.language as Language;

        const message =
          firstRecord.message[currentLanguage] ??
          firstRecord.message[DEFAULT_LANGUAGE];

        error.evaluatedMessage = message;
      } else {
        error.evaluatedMessage = error.message;
      }

      if (options?.onError) {
        options?.onError(error as TError);
      }
    },
  } as typeof options);
};

export default useBaseQuery;

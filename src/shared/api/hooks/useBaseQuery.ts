import {
  QueryFunction,
  UseQueryOptions,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';

import { DEFAULT_LANGUAGE, Language } from '@app/shared/lib';

import { BaseError } from '../types';

const useBaseQuery = <TResponse>(
  key: string[],
  queryFn: QueryFunction<AxiosResponse<TResponse, BaseError>>,
  options?: Omit<
    UseQueryOptions<AxiosResponse<TResponse, BaseError>, BaseError>,
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
        options?.onError(error);
      }
    },
  } as typeof options);
};

export default useBaseQuery;

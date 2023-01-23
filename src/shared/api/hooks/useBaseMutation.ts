import {
  MutationFunction,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';

import { DEFAULT_LANGUAGE, Language } from '@app/shared/lib';

import { BaseError } from '../types';

const useBaseMutation = <TRequest, TResponse>(
  key: string[],
  mutationFn: MutationFunction<AxiosResponse<TResponse, BaseError>, TRequest>,
  options?: Omit<
    UseMutationOptions<
      AxiosResponse<TResponse, BaseError>,
      BaseError,
      TRequest
    >,
    'mutationKey' | 'mutationFn'
  >,
) => {
  const { i18n } = useTranslation();

  return useMutation(key, mutationFn, {
    ...options,
    onError: (error: BaseError, variables: TRequest, context: unknown) => {
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
        options?.onError(error, variables, context);
      }
    },
  });
};

export default useBaseMutation;

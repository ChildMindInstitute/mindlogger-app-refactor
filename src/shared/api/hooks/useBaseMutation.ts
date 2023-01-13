import {
  MutationFunction,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

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
  return useMutation(key, mutationFn, {
    ...options,
    onError: (error: BaseError, variables: TRequest, context: unknown) => {
      if (error.response?.data?.messages?.length) {
        error.evaluatedMessage = error.response?.data?.messages[0];
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

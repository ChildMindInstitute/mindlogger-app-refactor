import { MutationFunction, UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { BaseError } from '../types';

const useBaseMutation = <TRequest, TResponse>(
  mutationFn: MutationFunction<AxiosResponse<TResponse, BaseError>, TRequest>,
  options?: Omit<UseMutationOptions<AxiosResponse<TResponse, BaseError>, BaseError, TRequest>, 'mutationFn'>,
) => {
  return useMutation(mutationFn, {
    ...options,
    onError: (error: BaseError, variables: TRequest, context: unknown) => {
      const errorRecords = error.response?.data?.result;

      if (errorRecords?.length) {
        const firstRecord = errorRecords[0];

        error.evaluatedMessage = firstRecord.message;
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

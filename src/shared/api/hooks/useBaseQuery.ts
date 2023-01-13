import {
  QueryFunction,
  UseQueryOptions,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { BaseError } from '../types';

const useBaseQuery = <TResponse>(
  key: string[],
  queryFn: QueryFunction<AxiosResponse<TResponse, BaseError>>,
  options?: Omit<
    UseQueryOptions<AxiosResponse<TResponse, BaseError>, BaseError>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery(key, queryFn, options);
};

export default useBaseQuery;

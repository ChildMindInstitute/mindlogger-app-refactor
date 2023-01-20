import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

import { Languages } from '../lib';

export type SuccessfulResponse<R> = {
  result: R;
};

export type SuccessfulEmptyResponse = {};

type ErrorRecord = {
  message: {
    [key in Languages]: string;
  };
  type: string;
  path: string[];
};

type ErrorResponse = {
  data: { results: ErrorRecord[] };
  status: number;
};

export type BaseError = {
  message?: string;
  response: ErrorResponse;
  code: string;
  evaluatedMessage?: string;
};

type FuncParams<TFetchReturn extends (...args: any) => any> =
  Parameters<TFetchReturn>[0];

export type QueryOptions<TFetchReturn extends (...args: any) => any> = Omit<
  UseQueryOptions<Awaited<ReturnType<TFetchReturn>>, BaseError>,
  'queryKey' | 'queryFn'
>;

export type MutationOptions<TFetchReturn extends (...args: any) => any> = Omit<
  UseMutationOptions<
    Awaited<ReturnType<TFetchReturn>>,
    BaseError,
    FuncParams<TFetchReturn>
  >,
  'queryKey' | 'queryFn'
>;

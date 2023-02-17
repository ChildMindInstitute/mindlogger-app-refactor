import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

import { Language } from '../lib';

export type SuccessfulResponse<R> = {
  result: R;
};

export type SuccessfulEmptyResponse = {};

type ErrorRecord = {
  message: Record<Language, string>;
  type: string;
  path: string[];
};

type ErrorResponse = {
  data: { result: ErrorRecord[] };
  status: number;
};

export type BaseError = {
  message?: string;
  response: ErrorResponse;
  code: string;
  evaluatedMessage?: string;
};

type AnyFn = (...args: any) => any;
type AnyPromiseFn = (...args: any) => Promise<any>;

type FnParams<TFn extends AnyFn> = Parameters<TFn>[0];

type QueryKey = [string, Record<string, unknown>?];

export type QueryOptions<
  TFetchFn extends AnyPromiseFn,
  TData = Awaited<ReturnType<TFetchFn>>,
  TQueryFnData = Awaited<ReturnType<TFetchFn>>,
  TError = BaseError,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, QueryKey>,
  'queryKey' | 'queryFn'
>;

export type ReturnAwaited<TFetchReturn extends AnyPromiseFn> = Awaited<
  ReturnType<TFetchReturn>
>;

export type MutationOptions<TFetchFn extends AnyPromiseFn> = Omit<
  UseMutationOptions<
    Awaited<ReturnType<TFetchFn>>,
    BaseError,
    FnParams<TFetchFn>
  >,
  'queryKey' | 'queryFn'
>;

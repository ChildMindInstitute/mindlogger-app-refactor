import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

// export interface IBaseResponse {
//   headers?: any | null;
//   status: number;
//   statusText?: string;
// }

// export interface IResponseData<TData> {
//   isSuccess: boolean;
//   data: TData;
//   errors?: string[];
// }

// export interface IErrorResponseData {
//   isSuccess: boolean;
//   errors?: string[];
// }

// export interface IErrorResponse {
//   data: IErrorResponseData;
// }

// export interface IApiError {
//   response?: IErrorResponse | undefined | null;
//   message: string;
// }

export type SuccessfulResponse<R> = {
  result: R;
};

export type SuccessfulEmptyResponse = {};

export type BaseError = {
  message?: string;
  response: { data: { messages: string[] } };
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

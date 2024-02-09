import { AxiosResponse } from 'axios';

export const toAxiosResponse = <TData>(data: TData): AxiosResponse<TData, any> => {
  return {
    data,
  } as AxiosResponse<TData, any>;
};

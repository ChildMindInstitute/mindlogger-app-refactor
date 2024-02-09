import { QueryClient, QueryKey } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

type AppQueryKey = [string, Record<string, unknown>?];

export const getDataFromQuery = <TResponse>(key: QueryKey, queryClient: QueryClient): TResponse | null => {
  const data: Array<[QueryKey, AxiosResponse<TResponse> | undefined]> = queryClient.getQueriesData({
    queryKey: key,
    exact: true,
  });

  if (!data?.length || !data[0][1]) {
    return null;
  }
  return data[0][1].data;
};

export const hasPendingMutations = (queryClient: QueryClient): boolean => {
  return !!queryClient
    .getMutationCache()
    .getAll()
    .some((x) => x.state.status === 'loading' || x.state.status === 'idle');
};

export const getAppletsKey = () => ['applets'];

export const getAppletDetailsKey = (appletId: string) => ['applets', { appletId }];

export const getAllEventsKey = () => ['events'] satisfies AppQueryKey;

export const getEventsKey = (appletId: string) => ['events', { appletId }];

export const getActivityDetailsKey = (activityId: string) => ['activities', { activityId }];

export const getCompletedEntitiesKey = () => ['completed-entities'] satisfies AppQueryKey;

export const getAppletCompletedEntitiesKey = (appletId: string) =>
  ['completed-entities', { appletId }] satisfies AppQueryKey;

export const getRefreshingKey = () => ['refresh'] satisfies AppQueryKey;

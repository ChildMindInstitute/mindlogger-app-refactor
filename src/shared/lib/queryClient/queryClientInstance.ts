import { QueryClient } from '@tanstack/react-query';

let instance: QueryClient;
export const getDefaultQueryClient = () => {
  if (!instance) {
    instance = new QueryClient({
      defaultOptions: {
        mutations: {
          cacheTime: Infinity,
          retry: 0,
        },
        queries: {
          retry: 2,
          cacheTime: Infinity,
          staleTime: Infinity,
        },
      },
    });
  }
  return instance;
};

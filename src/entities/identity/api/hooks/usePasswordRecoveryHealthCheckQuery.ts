import {
  IdentityService,
  QueryOptions,
  ReturnAwaited,
  useBaseQuery,
} from '@app/shared/api';

type FetchFn = typeof IdentityService.passwordRecoveryHealthCheck;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const usePasswordRecoveryHealthCheckQuery = <
  TData = ReturnAwaited<FetchFn>,
>(
  email: string,
  key: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['password-recovery-health', { email, key }],
    () => IdentityService.passwordRecoveryHealthCheck({ email, key }),
    {
      ...options,
      cacheTime: 0,
    },
  );
};

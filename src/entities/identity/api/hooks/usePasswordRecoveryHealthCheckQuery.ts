import { useBaseQuery } from '@app/shared/api/hooks/useBaseQuery';
import { getDefaultIdentityService } from '@app/shared/api/services/identityServiceInstance';
import { QueryOptions, ReturnAwaited } from '@app/shared/api/types';

const identityService = getDefaultIdentityService();

type FetchFn = typeof identityService.passwordRecoveryHealthCheck;
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
    () => identityService.passwordRecoveryHealthCheck({ email, key }),
    {
      ...options,
      cacheTime: 0,
    },
  );
};

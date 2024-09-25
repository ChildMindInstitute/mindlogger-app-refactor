import { useBaseMutation } from '@app/shared/api/hooks/useBaseMutation';
import { getDefaultIdentityService } from '@app/shared/api/services/identityServiceInstance';
import { MutationOptions } from '@app/shared/api/types';

const identityService = getDefaultIdentityService();

type Options = MutationOptions<typeof identityService.passwordRecover>;

export const usePasswordRecoveryMutation = (options?: Options) => {
  return useBaseMutation(identityService.passwordRecover, {
    ...options,
    cacheTime: 0,
  });
};

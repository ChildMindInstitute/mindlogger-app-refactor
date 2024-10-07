import { useBaseMutation } from '@app/shared/api/hooks/useBaseMutation';
import { getDefaultIdentityService } from '@app/shared/api/services/identityServiceInstance';
import { MutationOptions } from '@app/shared/api/types';

const identityService = getDefaultIdentityService();

type Options = MutationOptions<typeof identityService.changePassword>;

export const useChangePasswordMutation = (options?: Options) => {
  return useBaseMutation(identityService.changePassword, {
    ...options,
    cacheTime: 0,
  });
};

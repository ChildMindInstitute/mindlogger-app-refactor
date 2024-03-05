import {
  useBaseMutation,
  IdentityService,
  MutationOptions,
} from '@app/shared/api';

type Options = MutationOptions<typeof IdentityService.approvePasswordRecovery>;

export const useApprovePasswordRecoveryMutation = (options?: Options) => {
  return useBaseMutation(IdentityService.approvePasswordRecovery, {
    ...options,
    cacheTime: 0,
  });
};

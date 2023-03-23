import {
  useBaseMutation,
  IdentityService,
  MutationOptions,
} from '@app/shared/api';

type Options = MutationOptions<typeof IdentityService.passwordRecover>;

export const usePasswordRecoveryMutation = (options?: Options) => {
  return useBaseMutation(IdentityService.passwordRecover, {
    ...options,
    cacheTime: 0,
  });
};

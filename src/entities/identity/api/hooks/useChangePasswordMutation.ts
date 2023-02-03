import {
  useBaseMutation,
  IdentityService,
  MutationOptions,
} from '@app/shared/api';

type Options = MutationOptions<typeof IdentityService.changePassword>;

export const useChangePasswordMutation = (options?: Options) => {
  return useBaseMutation(['change-password'], IdentityService.changePassword, {
    ...options,
    cacheTime: 0,
  });
};

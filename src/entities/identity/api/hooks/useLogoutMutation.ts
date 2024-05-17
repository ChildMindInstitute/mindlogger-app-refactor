import {
  useBaseMutation,
  IdentityService,
  MutationOptions,
} from '@app/shared/api';

type Options = MutationOptions<typeof IdentityService.logout>;

export const useLogoutMutation = (options?: Options) => {
  return useBaseMutation(IdentityService.logout, {
    ...options,
    cacheTime: 0,
  });
};

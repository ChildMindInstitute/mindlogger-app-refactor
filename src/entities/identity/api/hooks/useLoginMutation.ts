import {
  useBaseMutation,
  IdentityService,
  MutationOptions,
} from '@app/shared/api';

type Options = MutationOptions<typeof IdentityService.login>;

export const useLoginMutation = (options?: Options) => {
  return useBaseMutation(IdentityService.login, {
    ...options,
    cacheTime: 0,
  });
};

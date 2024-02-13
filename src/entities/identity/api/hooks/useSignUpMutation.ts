import {
  useBaseMutation,
  IdentityService,
  MutationOptions,
} from '@app/shared/api';

type Options = MutationOptions<typeof IdentityService.signUp>;

export const useSignUpMutation = (options?: Options) => {
  return useBaseMutation(IdentityService.signUp, {
    ...options,
    cacheTime: 0,
  });
};

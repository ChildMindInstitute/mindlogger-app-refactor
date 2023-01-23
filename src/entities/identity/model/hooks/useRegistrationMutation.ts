import { useLoginMutation } from '@app/entities/identity';
import { useSignUpMutation } from '@app/entities/identity';
import { BaseError } from '@app/shared/api';
import { useAppDispatch } from '@app/shared/lib';

import { actions, storeTokens } from '../';

type UseRegistrationReturn = {
  isLoading: boolean;
  error?: BaseError | null;
  mutate: ReturnType<typeof useSignUpMutation>['mutate'];
};

export const useRegistrationMutation = (
  onSuccess: () => void,
): UseRegistrationReturn => {
  const dispatch = useAppDispatch();

  const {
    isLoading: isLoginLoading,
    mutate: login,
    error: loginError,
  } = useLoginMutation({
    onSuccess: (response, { password }) => {
      const { user, token } = response.data.result;

      dispatch(actions.onAuthSuccess(user));

      storeTokens({
        ...token,
        password,
      });

      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const {
    isLoading: isSignUpLoading,
    isSuccess: isSignUpSuccess,
    error: signUpError,
    mutate: signUp,
  } = useSignUpMutation({
    onSuccess: (_, data) => {
      login({ email: data.email, password: data.password });
    },
  });

  const result: UseRegistrationReturn = {
    isLoading: false,
    mutate: signUp,
  };

  if (isSignUpSuccess) {
    result.error = loginError;
    result.isLoading = isLoginLoading;
  } else {
    result.error = signUpError;
    result.isLoading = isSignUpLoading;
  }

  return result;
};

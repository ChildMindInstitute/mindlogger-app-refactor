import { UserInfoRecord } from '@app/entities/identity/lib';
import {
  useLoginMutation,
  useSignUpMutation,
  IdentityModel,
} from '@entities/identity';
import { SessionModel } from '@entities/session';
import { useAppDispatch } from '@shared/lib';

type UseRegistrationReturn = {
  isLoading: boolean;
  error?: ReturnType<typeof useSignUpMutation>['error'];
  mutate: ReturnType<typeof useSignUpMutation>['mutate'];
  reset: ReturnType<typeof useSignUpMutation>['reset'];
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
    onSuccess: response => {
      const { user, token: session } = response.data.result;

      dispatch(IdentityModel.actions.onAuthSuccess(user));

      UserInfoRecord.set(user.email);

      SessionModel.storeSession(session);

      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const {
    reset,
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
    reset,
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

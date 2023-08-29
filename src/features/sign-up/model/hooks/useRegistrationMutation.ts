import {
  UserInfoRecord,
  UserPrivateKeyRecord,
} from '@app/entities/identity/lib';
import { SystemRecord } from '@app/shared/lib/records';
import {
  useLoginMutation,
  useSignUpMutation,
  IdentityModel,
} from '@entities/identity';
import { SessionModel } from '@entities/session';
import { useAppDispatch } from '@shared/lib';
import { encryption } from '@shared/lib';

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
    onSuccess: (response, variables) => {
      const userParams = {
        userId: response.data.result.user.id,
        email: response.data.result.user.email,
        password: variables.password,
      };

      const userPrivateKey = encryption.getPrivateKey(userParams);

      UserPrivateKeyRecord.set(userPrivateKey);

      const { user, token: session } = response.data.result;

      dispatch(IdentityModel.actions.onAuthSuccess(user));

      UserInfoRecord.setEmail(user.email);

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
      login({
        email: data.email,
        password: data.password,
        deviceId: SystemRecord.getDeviceId(),
      });
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

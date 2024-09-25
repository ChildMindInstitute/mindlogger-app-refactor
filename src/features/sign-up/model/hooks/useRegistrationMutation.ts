import { useLoginMutation } from '@app/entities/identity/api/hooks/useLoginMutation';
import { useSignUpMutation } from '@app/entities/identity/api/hooks/useSignUpMutation';
import { getDefaultUserInfoRecord } from '@app/entities/identity/lib/userInfoRecord';
import { getDefaultUserPrivateKeyRecord } from '@app/entities/identity/lib/userPrivateKeyRecordInstance';
import { identityActions } from '@app/entities/identity/model/slice';
import { storeSession } from '@app/entities/session/model/operations';
import {
  AnalyticsService,
  MixEvents,
} from '@app/shared/lib/analytics/AnalyticsService';
import { getDefaultEncryptionManager } from '@app/shared/lib/encryption/encryptionManagerInstance';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { getDefaultSystemRecord } from '@app/shared/lib/records/systemRecordInstance';

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

      const userPrivateKey =
        getDefaultEncryptionManager().getPrivateKey(userParams);

      getDefaultUserPrivateKeyRecord().set(userPrivateKey);

      const { user, token: session } = response.data.result;

      dispatch(identityActions.onAuthSuccess(user));

      getDefaultUserInfoRecord().setEmail(user.email);

      storeSession(session);

      AnalyticsService.login(user.id).then(() => {
        AnalyticsService.track(MixEvents.SignupSuccessful);
      });

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
        deviceId: getDefaultSystemRecord().getDeviceId(),
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

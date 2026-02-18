import { useLoginMutation } from '@app/entities/identity/api/hooks/useLoginMutation';
import { useSignUpMutation } from '@app/entities/identity/api/hooks/useSignUpMutation';
import { getDefaultUserInfoRecord } from '@app/entities/identity/lib/userInfoRecord';
import { getDefaultUserPrivateKeyRecord } from '@app/entities/identity/lib/userPrivateKeyRecordInstance';
import { identityActions } from '@app/entities/identity/model/slice';
import { storeSession } from '@app/entities/session/model/operations';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import { MixEvents } from '@app/shared/lib/analytics/IAnalyticsService';
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
      const data = response.data.result;

      // Registration should not trigger MFA, but check just in case
      const isMfaRequired =
        ('mfa_required' in data && data.mfa_required) ||
        ('mfaRequired' in data && data.mfaRequired);

      if (isMfaRequired) {
        console.error('Unexpected MFA required during registration');
        return;
      }

      // Type assertion - we know it's a successful login response
      const result = data as {
        token: { accessToken: string; refreshToken: string; tokenType: string };
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
        };
      };

      const userParams = {
        userId: result.user.id,
        email: result.user.email,
        password: variables.password,
      };

      const userPrivateKey =
        getDefaultEncryptionManager().getPrivateKey(userParams);

      getDefaultUserPrivateKeyRecord().set(userPrivateKey);

      const { user, token: session } = result;

      dispatch(identityActions.onAuthSuccess(user));

      getDefaultUserInfoRecord().setEmail(user.email);

      storeSession(session);

      getDefaultAnalyticsService()
        .login(user.id)
        .then(() => {
          getDefaultAnalyticsService().track(MixEvents.SignupSuccessful);
        })
        .catch(console.error);

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

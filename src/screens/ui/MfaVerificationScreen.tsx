import { FC, useState, useEffect, useRef } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isTablet } from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMfaVerifyMutation } from '@app/entities/identity/api/hooks/useMfaVerifyMutation';
import { getDefaultMfaTokenRecord } from '@app/entities/identity/lib/mfaTokenRecordInstance';
import { getDefaultUserInfoRecord } from '@app/entities/identity/lib/userInfoRecord';
import { getDefaultUserPrivateKeyRecord } from '@app/entities/identity/lib/userPrivateKeyRecordInstance';
import { identityActions } from '@app/entities/identity/model/slice';
import { storeSession } from '@app/entities/session/model/operations';
import {
  getMfaErrorMessage,
  shouldNavigateToLogin,
} from '@app/features/mfa-verification/lib/mfaErrorHandler';
import { useMfaAttemptsTracker } from '@app/features/mfa-verification/lib/useMfaAttemptsTracker';
import { MfaVerificationForm } from '@app/features/mfa-verification/ui/MfaVerificationForm';
import { openUrl } from '@app/screens/lib/utils/helpers';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import { MixEvents } from '@app/shared/lib/analytics/IAnalyticsService';
import { getDefaultEncryptionManager } from '@app/shared/lib/encryption/encryptionManagerInstance';
import { getDefaultFeatureFlagsService } from '@app/shared/lib/featureFlags/featureFlagsServiceInstance';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { getDefaultSystemRecord } from '@app/shared/lib/records/systemRecordInstance';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, XStack } from '@app/shared/ui/base';
import { Link } from '@app/shared/ui/Link';

import { RootStackParamList } from '../config/types';

export const MfaVerificationScreen: FC = () => {
  const { navigate } = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'MfaVerification'>>();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { mfaToken, email, password } = route.params;

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    updateFromApiError,
    resetAttempts,
    getWarningMessage,
    getWarningCount,
  } = useMfaAttemptsTracker();

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const { mutate: verifyMfa, isLoading } = useMfaVerifyMutation({
    onSuccess: response => {
      setErrorMessage(undefined);
      resetAttempts();

      // Clear MFA token from storage after successful verification
      getDefaultMfaTokenRecord().clear();

      const result = response.data.result;

      if (!result || !result.user || !result.token) {
        console.error('Invalid response structure:', result);
        setErrorMessage(t('mfa_verification:error_unknown'));
        return;
      }

      const { user, token: session } = result;

      // Handle both snake_case and camelCase formats from backend
      const accessToken = session.accessToken || session.access_token || '';
      const refreshToken = session.refreshToken || session.refresh_token || '';
      const tokenType = session.tokenType || session.token_type || 'Bearer';

      const userParams = {
        userId: user.id,
        email,
        password,
      };

      const userPrivateKey =
        getDefaultEncryptionManager().getPrivateKey(userParams);

      getDefaultUserPrivateKeyRecord().set(userPrivateKey);
      dispatch(identityActions.onAuthSuccess(user));
      getDefaultUserInfoRecord().setEmail(user.email);

      // Map backend response (snake_case or camelCase) to app format (camelCase)
      storeSession({
        accessToken,
        refreshToken,
        tokenType,
      });

      getDefaultAnalyticsService()
        .login(user.id)
        .then(() => {
          getDefaultAnalyticsService().track(MixEvents.LoginSuccessful);
        })
        .catch(console.error);

      getDefaultFeatureFlagsService().login(user.id).catch(console.error);

      navigate('Applets');
    },
    onError: err => {
      console.error('MFA verification failed:', err);

      updateFromApiError(err);

      const errorKey = getMfaErrorMessage(err, 'mfa_verification');
      setErrorMessage(t(errorKey));

      if (shouldNavigateToLogin(err)) {
        setSessionExpired(true);

        navigationTimeoutRef.current = setTimeout(() => {
          navigate('Login');
        }, 2000);
      }
    },
  });

  const navigateToAppLanguage = () => {
    navigate('ChangeLanguage');
  };

  const handleVerificationSuccess = (code: string) => {
    executeIfOnline(() => {
      verifyMfa({
        mfa_token: mfaToken,
        totp_code: code,
        device_id: getDefaultSystemRecord().getDeviceId(),
      });
    });
  };

  const handleUseRecoveryCode = () => {
    navigate('MfaRecovery', {
      mfaToken,
      email,
      password,
    });
  };

  const handleErrorClear = () => {
    setErrorMessage(undefined);
  };

  const warningKey = getWarningMessage();
  const warningCount = getWarningCount();

  const attemptsWarningMessage =
    warningKey && warningCount !== null
      ? t(warningKey, { count: warningCount })
      : undefined;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} px={isTablet() ? '$20' : 0}>
        <Box flex={1} px="$8" jc="space-between" py={48}>
          <Box flex={1} jc="center">
            <MfaVerificationForm
              onVerificationSuccess={handleVerificationSuccess}
              onUseRecoveryCode={handleUseRecoveryCode}
              isLoading={isLoading}
              error={errorMessage}
              sessionExpired={sessionExpired}
              attemptsWarning={attemptsWarningMessage}
              onErrorClear={handleErrorClear}
            />
          </Box>

          <XStack
            jc="space-around"
            mb={bottom + 72}
            flexWrap="wrap"
            ai="center"
          >
            <Link
              textDecorationLine="underline"
              accessibilityLabel="change_language-link"
              onPress={navigateToAppLanguage}
            >
              {t('language_screen:change_app_language')}
            </Link>

            <Link
              textDecorationLine="underline"
              onPress={() => openUrl('https://mindlogger.org/terms-of-service')}
              accessibilityLabel="terms_of_service_link"
            >
              {t('auth:terms')}
            </Link>
          </XStack>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

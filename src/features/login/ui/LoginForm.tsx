/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { DdSdkReactNative } from '@datadog/mobile-react-native';
import { useNavigation } from '@react-navigation/native';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useLoginMutation } from '@app/entities/identity/api/hooks/useLoginMutation';
import { getDefaultUserInfoRecord } from '@app/entities/identity/lib/userInfoRecord';
import { getDefaultUserPrivateKeyRecord } from '@app/entities/identity/lib/userPrivateKeyRecordInstance';
import { selectUserId } from '@app/entities/identity/model/selectors';
import { identityActions } from '@app/entities/identity/model/slice';
import { storeSession } from '@app/entities/session/model/operations';
import { UserDto } from '@app/shared/api/services/IIdentityService';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import {
  MixEvents,
  MixProperties,
} from '@app/shared/lib/analytics/IAnalyticsService';
import { getDefaultEncryptionManager } from '@app/shared/lib/encryption/encryptionManagerInstance';
import { getDefaultFeatureFlagsService } from '@app/shared/lib/featureFlags/featureFlagsServiceInstance';
import { useAppDispatch, useAppSelector } from '@app/shared/lib/hooks/redux';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { useFormChanges } from '@app/shared/lib/hooks/useFormChanges';
import { getDefaultSystemRecord } from '@app/shared/lib/records/systemRecordInstance';
import { cleanUpAction } from '@app/shared/lib/redux-state/actions';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps, YStack } from '@app/shared/ui/base';
import { Center } from '@app/shared/ui/Center';
import { ErrorMessage } from '@app/shared/ui/form/ErrorMessage';
import { InputField } from '@app/shared/ui/form/InputField';
import { Link } from '@app/shared/ui/Link';
import { SubmitButton } from '@app/shared/ui/SubmitButton';

import { cleanupData } from '../../auth/model/cleanupData';
import { LoginFormSchema } from '../model/LoginFormSchema';

type Props = {
  onLoginSuccess: () => void;
} & BoxProps;

export const LoginForm: FC<Props> = props => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserId);

  const navigateToForgotPassword = () => {
    navigate('ForgotPassword');
  };

  const {
    mutate: login,
    error,
    isLoading,
    reset,
  } = useLoginMutation({
    onError: err => {
      // Track login failed at credentials stage
      getDefaultAnalyticsService().track(MixEvents.LoginFailed, {
        [MixProperties.FailureStage]: 'Credentials',
        [MixProperties.MFARequired]: false,
        [MixProperties.MFAMethodUsed]: null,
      });
    },
    onSuccess: async (response, variables) => {
      const data = response.data.result;

      // MFA required
      if ('mfaRequired' in data && data.mfaRequired) {
        // Track Login Button Click with MFA required
        getDefaultAnalyticsService().track(MixEvents.LoginBtnClick, {
          [MixProperties.MFARequired]: true,
          [MixProperties.AuthMethod]: 'Password',
        });

        // Track MFA Required event
        getDefaultAnalyticsService().track(MixEvents.MFARequired);

        const mfaToken = data.mfaToken;
        const userIdFromMfa = data.userId;
        const userEmailFromMfa = data.userEmail;

        if (!mfaToken) {
          console.error('MFA required but no mfaToken in response');
          return;
        }

        if (!userIdFromMfa || !userEmailFromMfa) {
          console.error(
            'MFA required but missing user_id or user_email in response',
          );
          return;
        }

        // Setup encryption before MFA navigation
        const userParams = {
          userId: userIdFromMfa,
          email: userEmailFromMfa,
          password: variables.password,
        };

        // Cleanup if different user
        if (userParams.userId !== userId) {
          await cleanupData();
          dispatch(cleanUpAction());
        }

        // Derive and store private key
        const userPrivateKey =
          getDefaultEncryptionManager().getPrivateKey(userParams);
        getDefaultUserPrivateKeyRecord().set(userPrivateKey);
        getDefaultUserInfoRecord().setEmail(userEmailFromMfa);

        navigate('MfaVerification', {
          mfaToken,
          userId: userIdFromMfa,
        });
        return;
      }

      // Standard login flow (no MFA) - after type guard, data must be LoginSuccessResponse
      // TypeScript doesn't narrow union types automatically, so we cast
      const loginData = data as {
        token: { accessToken: string; refreshToken: string; tokenType: string };
        user: UserDto;
      };

      // Track Login Button Click without MFA
      getDefaultAnalyticsService().track(MixEvents.LoginBtnClick, {
        [MixProperties.MFARequired]: false,
        [MixProperties.AuthMethod]: 'Password',
      });

      const userParams = {
        userId: loginData.user.id,
        email: loginData.user.email,
        password: variables.password,
      };

      await DdSdkReactNative.setUserInfo({ id: loginData.user.id });

      // If the previously logged-in user's ID is not the same as the just
      // logged-in user's ID, then clear previously stored data.
      // We are able to make this determination because previously stored data
      // is not cleared on log out (only session info is cleared on log out),
      // and this is an intended behaviour.
      if (userParams.userId !== userId) {
        await cleanupData();
        dispatch(cleanUpAction());
      }

      const userPrivateKey =
        getDefaultEncryptionManager().getPrivateKey(userParams);

      getDefaultUserPrivateKeyRecord().set(userPrivateKey);

      const { user, token: session } = loginData;

      dispatch(identityActions.onAuthSuccess(user));

      getDefaultUserInfoRecord().setEmail(user.email);

      storeSession(session);

      getDefaultAnalyticsService()
        .login(user.id)
        .then(() => {
          getDefaultAnalyticsService().track(MixEvents.LoginSuccessful, {
            [MixProperties.MFAUsed]: false,
            [MixProperties.MFAMethodUsed]: null,
            [MixProperties.UserId]: user.id,
          });
        })
        .catch(console.error);

      getDefaultFeatureFlagsService().login(user.id).catch(console.error);

      props.onLoginSuccess();
    },
  });

  const { form, submit } = useAppForm(LoginFormSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmitSuccess: data => {
      executeIfOnline(() => {
        login({
          ...data,
          deviceId: getDefaultSystemRecord().getDeviceId(),
        });
      });
    },
  });

  useFormChanges({
    form,
    onInputChange: () => reset(),
    watchInputs: ['password'],
  });

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack space={16}>
          <InputField
            name="email"
            keyboardType="email-address"
            accessibilityLabel="login-email-input"
            placeholder={t('login_form:email_placeholder')}
            submitBehavior="submit"
            onSubmitEditing={() => {
              submit().catch(console.error);
            }}
            returnKeyType="go"
          />

          <InputField
            secureTextEntry
            name="password"
            accessibilityLabel="login-password-input"
            placeholder={t('auth:password')}
            submitBehavior="submit"
            onSubmitEditing={() => {
              submit().catch(console.error);
            }}
            returnKeyType="go"
          />

          {error && (
            <ErrorMessage
              mode="light"
              accessibilityLabel="login-error-message"
              error={{ message: error.evaluatedMessage ?? '' }}
            />
          )}
        </YStack>

        <Center mt={40}>
          <Link
            textDecorationLine="underline"
            accessibilityLabel="forgot_password-link"
            onPress={navigateToForgotPassword}
          >
            {t('login:forgot_password')}
          </Link>
        </Center>

        <SubmitButton
          mt={34}
          isLoading={isLoading}
          accessibilityLabel="login-button"
          width="100%"
          onPress={() => {
            submit().catch(console.error);
          }}
          buttonStyle={{ alignSelf: 'center', paddingVertical: 16 }}
        >
          {t('login_form:login')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

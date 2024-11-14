/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { useNavigation } from '@react-navigation/native';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useLoginMutation } from '@app/entities/identity/api/hooks/useLoginMutation';
import { getDefaultUserInfoRecord } from '@app/entities/identity/lib/userInfoRecord';
import { getDefaultUserPrivateKeyRecord } from '@app/entities/identity/lib/userPrivateKeyRecordInstance';
import { selectUserId } from '@app/entities/identity/model/selectors';
import { identityActions } from '@app/entities/identity/model/slice';
import { storeSession } from '@app/entities/session/model/operations';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import { MixEvents } from '@app/shared/lib/analytics/IAnalyticsService';
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
    onSuccess: async (response, variables) => {
      const userParams = {
        userId: response.data.result.user.id,
        email: response.data.result.user.email,
        password: variables.password,
      };

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

      const { user, token: session } = response.data.result;

      dispatch(identityActions.onAuthSuccess(user));

      getDefaultUserInfoRecord().setEmail(user.email);

      storeSession(session);

      getDefaultAnalyticsService()
        .login(user.id)
        .then(() => {
          getDefaultAnalyticsService().track(MixEvents.LoginSuccessful);
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
            accessibilityLabel="login-email-input"
            placeholder={t('login_form:email_placeholder')}
          />

          <InputField
            secureTextEntry
            name="password"
            accessibilityLabel="login-password-input"
            placeholder={t('auth:password')}
          />

          {error && (
            <ErrorMessage
              mode="light"
              accessibilityLabel="login-error-message"
              error={{ message: error.evaluatedMessage! }}
            />
          )}
        </YStack>

        <Center mt={42}>
          <Link
            textDecorationLine="underline"
            accessibilityLabel="forgot_password-link"
            onPress={navigateToForgotPassword}
          >
            {t('login:forgot_password')}
          </Link>
        </Center>

        <SubmitButton
          mt={32}
          isLoading={isLoading}
          accessibilityLabel="login-button"
          borderRadius={30}
          width="100%"
          bg="$lighterGrey6"
          textProps={{
            fontSize: 14,
            color: 'black',
          }}
          onPress={submit}
          buttonStyle={{ alignSelf: 'center', paddingVertical: 16 }}
        >
          {t('login_form:login')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

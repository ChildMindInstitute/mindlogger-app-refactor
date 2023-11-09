/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { useNavigation } from '@react-navigation/native';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SystemRecord } from '@app/shared/lib/records';
import { IdentityModel, useLoginMutation } from '@entities/identity';
import { UserInfoRecord, UserPrivateKeyRecord } from '@entities/identity/lib';
import { SessionModel } from '@entities/session';
import {
  executeIfOnline,
  useAppDispatch,
  useAppForm,
  useFormChanges,
} from '@shared/lib';
import { encryption } from '@shared/lib';
import { YStack, Box, BoxProps, SubmitButton, Center, Link } from '@shared/ui';
import { ErrorMessage, InputField } from '@shared/ui/form';

import { LoginFormSchema } from '../model';

type Props = {
  onLoginSuccess: () => void;
} & BoxProps;

const LoginForm: FC<Props> = props => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const dispatch = useAppDispatch();

  const navigateToForgotPassword = () => {
    navigate('ForgotPassword');
  };

  const {
    mutate: login,
    error,
    isLoading,
    reset,
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
          deviceId: SystemRecord.getDeviceId(),
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
            placeholder={t('login_form:email_placeholder')}
          />

          <InputField
            secureTextEntry
            name="password"
            placeholder={t('auth:password')}
          />

          {error && (
            <ErrorMessage
              mode="light"
              error={{ message: error.evaluatedMessage! }}
            />
          )}
        </YStack>

        <Center mt={42}>
          <Link
            textDecorationLine="underline"
            onPress={navigateToForgotPassword}
          >
            {t('login:forgot_password')}
          </Link>
        </Center>

        <SubmitButton
          mt={32}
          isLoading={isLoading}
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

export default LoginForm;

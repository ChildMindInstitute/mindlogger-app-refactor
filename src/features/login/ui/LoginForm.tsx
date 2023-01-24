/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { IdentityModel, useLoginMutation } from '@app/entities/identity';
import { useAppDispatch, useAppForm } from '@shared/lib';
import { ProgressButton, YStack, Box, BoxProps } from '@shared/ui';
import { ErrorMessage, InputField } from '@shared/ui/form';

import { LoginFormSchema } from '../model';

type Props = {
  onLoginSuccess: () => void;
} & BoxProps;

const LoginForm: FC<Props> = props => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const {
    mutate: login,
    error,
    isLoading,
  } = useLoginMutation({
    onSuccess: (response, { password }) => {
      const { user, token } = response.data.result;

      dispatch(IdentityModel.actions.onAuthSuccess(user));

      IdentityModel.storeTokens({
        ...token,
        password,
      });

      props.onLoginSuccess();
    },
  });

  const { form, submit } = useAppForm(LoginFormSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmitSuccess: data => {
      login(data);
    },
  });

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack space={8} mb={40}>
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
            <ErrorMessage error={{ message: error.evaluatedMessage! }} />
          )}
        </YStack>

        <ProgressButton
          isLoading={isLoading}
          onClick={submit}
          text={t('login_form:login')}
          buttonStyle={{ width: 160, alignSelf: 'center' }}
          spinnerColor="tertiary"
        />
      </FormProvider>
    </Box>
  );
};

export default LoginForm;

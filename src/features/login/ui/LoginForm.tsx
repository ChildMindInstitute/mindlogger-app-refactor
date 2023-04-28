/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { UserEmailRecord } from '@app/entities/identity/lib';
import { IdentityModel, useLoginMutation } from '@entities/identity';
import { SessionModel } from '@entities/session';
import {
  executeIfOnline,
  useAppDispatch,
  useAppForm,
  useFormChanges,
} from '@shared/lib';
import { YStack, Box, BoxProps, SubmitButton } from '@shared/ui';
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
    reset,
  } = useLoginMutation({
    onSuccess: response => {
      const { user, token: session } = response.data.result;

      dispatch(IdentityModel.actions.onAuthSuccess(user));

      UserEmailRecord.set(user.email);

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
      executeIfOnline(() => login(data));
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
            <ErrorMessage
              mode="light"
              error={{ message: error.evaluatedMessage! }}
            />
          )}
        </YStack>

        <SubmitButton
          isLoading={isLoading}
          onPress={submit}
          buttonStyle={{ alignSelf: 'center' }}
        >
          {t('login_form:login')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

export default LoginForm;

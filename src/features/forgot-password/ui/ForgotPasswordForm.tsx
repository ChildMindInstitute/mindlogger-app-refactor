/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { usePasswordRecoveryMutation } from '@app/entities/identity';
import { useAppForm } from '@shared/lib';
import { YStack, Box, BoxProps, SubmitButton } from '@shared/ui';
import { ErrorMessage, InputField } from '@shared/ui/form';

import { ForgotPasswordFormSchema } from '../model';

type Props = BoxProps & {
  onRecoverySuccess: () => void;
};

const ForgotPasswordForm: FC<Props> = props => {
  const { t } = useTranslation();

  const {
    mutate: recover,
    error,
    isLoading,
  } = usePasswordRecoveryMutation({
    onSuccess: () => {
      props.onRecoverySuccess();
    },
  });

  const { form, submit } = useAppForm(ForgotPasswordFormSchema, {
    defaultValues: {
      email: '',
    },
    onSubmitSuccess: data => {
      recover({ email: data.email });
    },
  });

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack mb={40}>
          <InputField name="email" placeholder={t('auth:email_address')} />

          {error && (
            <ErrorMessage error={{ message: error.evaluatedMessage! }} mt={8} />
          )}
        </YStack>

        <SubmitButton
          isLoading={isLoading}
          onPress={submit}
          buttonStyle={{ alignSelf: 'center', paddingHorizontal: 24 }}>
          {t('forgot_pass_form:reset_pass')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

export default ForgotPasswordForm;

/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';

import { usePasswordRecoveryMutation } from '@app/entities/identity';
import { executeIfOnline, useAppForm, useFormChanges } from '@shared/lib';
import { YStack, Box, BoxProps, SubmitButton } from '@shared/ui';
import { ErrorMessage, InputField } from '@shared/ui/form';

import { ForgotPasswordFormSchema } from '../model';

type Props = BoxProps & {
  onRecoverySuccess: () => void;
};

const ForgotPasswordForm: FC<Props> = props => {
  const { t } = useTranslation();
  const toast = useToast();

  const {
    mutate: recover,
    error,
    isLoading,
    reset,
  } = usePasswordRecoveryMutation({
    onSuccess: () => {
      props.onRecoverySuccess();
      toast.show(t('forgot_pass_form:email_sent'));
    },
  });

  const { form, submit } = useAppForm(ForgotPasswordFormSchema, {
    defaultValues: {
      email: '',
    },
    onSubmitSuccess: data => {
      executeIfOnline(() => recover({ email: data.email }));
    },
  });

  useFormChanges({ form, onInputChange: () => reset() });

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack mb={40}>
          <InputField
            accessibilityLabel="forgot-password-email-input"
            name="email"
            placeholder={t('auth:email_address')}
          />

          {error && (
            <ErrorMessage
              mode="light"
              error={{ message: error.evaluatedMessage! }}
              mt={8}
            />
          )}
        </YStack>

        <SubmitButton
          isLoading={isLoading}
          accessibilityLabel="reset_password-button"
          onPress={submit}
          buttonStyle={{ alignSelf: 'center', paddingHorizontal: 24 }}
        >
          {t('forgot_pass_form:reset_pass')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

export default ForgotPasswordForm;

/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { usePasswordRecoveryMutation } from '@app/entities/identity/api/hooks/usePasswordRecoveryMutation';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { useBanner } from '@app/shared/lib/hooks/useBanner';
import { useFormChanges } from '@app/shared/lib/hooks/useFormChanges';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps, YStack } from '@app/shared/ui/base';
import { ErrorMessage } from '@app/shared/ui/form/ErrorMessage';
import { InputField } from '@app/shared/ui/form/InputField';
import { SubmitButton } from '@app/shared/ui/SubmitButton';

import { SuccessNotification } from './SuccessNotification';
import { ForgotPasswordFormSchema } from '../model/ForgotPasswordFormSchema';

type Props = BoxProps & {
  onRecoverySuccess: () => void;
};

export const ForgotPasswordForm: FC<Props> = props => {
  const { t } = useTranslation();
  const banner = useBanner();

  const { form, submit } = useAppForm(ForgotPasswordFormSchema, {
    defaultValues: {
      email: '',
    },
    onSubmitSuccess: data => {
      executeIfOnline(() => recover({ email: data.email }));
    },
  });

  const {
    mutate: recover,
    error,
    isLoading,
    reset,
  } = usePasswordRecoveryMutation({
    onSuccess: () => {
      props.onRecoverySuccess();
      banner.show(<SuccessNotification email={form.getValues().email} />, {
        type: 'success',
        visibilityTime: 5000,
      });
    },
    onError: () => {
      banner.show(t('forgot_pass_form:email_send_error'), {
        type: 'error',
        visibilityTime: 5000,
      });
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

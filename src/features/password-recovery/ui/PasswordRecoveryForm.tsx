import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useBanners } from '@app/entities/banner/lib/hooks/useBanners';
import { useApprovePasswordRecoveryMutation } from '@app/entities/identity/api/hooks/useApprovePasswordRecoveryMutation';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { useFormChanges } from '@app/shared/lib/hooks/useFormChanges';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps, YStack } from '@app/shared/ui/base';
import { ErrorMessage } from '@app/shared/ui/form/ErrorMessage';
import { InputField } from '@app/shared/ui/form/InputField';
import { SubmitButton } from '@app/shared/ui/SubmitButton';

import { PasswordRecoveryFormSchema } from '../model/PasswordRecoveryFormSchema';

type Props = BoxProps & {
  onPasswordRecoverySuccess: () => void;
  email: string;
  resetKey: string;
};

export const PasswordRecoveryForm: FC<Props> = props => {
  const { t } = useTranslation();
  const { addSuccessBanner, addErrorBanner } = useBanners();

  const {
    mutate: recoverPassword,
    error,
    isLoading,
    reset,
  } = useApprovePasswordRecoveryMutation({
    onSuccess: () => {
      props.onPasswordRecoverySuccess();
      addSuccessBanner(t('password_recovery_form:success'));
    },
    onError: () => {
      addErrorBanner(t('password_recovery_form:error'));
    },
  });

  const { form, submit } = useAppForm(PasswordRecoveryFormSchema, {
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    onSubmitSuccess: data => {
      executeIfOnline(() =>
        recoverPassword({
          email: props.email,
          key: props.resetKey,
          password: data.newPassword,
        }),
      );
    },
  });

  useFormChanges({ form, onInputChange: () => reset() });

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack space={8} mb={40}>
          <InputField
            aria-label="password-recovery-new-password-input"
            secureTextEntry
            name="newPassword"
            placeholder={t('password_recovery_form:new_password_placeholder')}
          />

          <InputField
            aria-label="password-recovery-confirm-password-input"
            secureTextEntry
            name="confirmPassword"
            placeholder={t(
              'password_recovery_form:confirm_password_placeholder',
            )}
          />

          {error && (
            <ErrorMessage
              aria-label="password-recovery-error-message"
              error={{ message: error.evaluatedMessage! }}
              mt={8}
            />
          )}
        </YStack>

        <SubmitButton
          aria-label="password-recovery-submit-button"
          mode="primary"
          onPress={submit}
          isLoading={isLoading}
        >
          {t('password_recovery_form:submit')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

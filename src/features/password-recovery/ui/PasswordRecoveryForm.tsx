import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useApprovePasswordRecoveryMutation } from '@app/entities/identity/api/hooks/useApprovePasswordRecoveryMutation';
import { colors } from '@app/shared/lib/constants/colors';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { useBanner } from '@app/shared/lib/hooks/useBanner';
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
  const banner = useBanner();

  const {
    mutate: recoverPassword,
    error,
    isLoading,
    reset,
  } = useApprovePasswordRecoveryMutation({
    onSuccess: () => {
      props.onPasswordRecoverySuccess();
      banner.show(t('password_recovery_form:success'), {
        type: 'success',
        visibilityTime: 5000,
      });
    },
    onError: () => {
      banner.show(t('password_recovery_form:error'), {
        type: 'danger',
        visibilityTime: 5000,
      });
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
            mode="dark"
            accessibilityLabel="password-recovery-new-password-input"
            backgroundColor="transparent"
            placeholderTextColor={colors.grey3}
            secureTextEntry
            name="newPassword"
            placeholder={t('password_recovery_form:new_password_placeholder')}
          />

          <InputField
            mode="dark"
            backgroundColor="transparent"
            accessibilityLabel="password-recovery-confirm-password-input"
            placeholderTextColor={colors.grey3}
            secureTextEntry
            name="confirmPassword"
            placeholder={t(
              'password_recovery_form:confirm_password_placeholder',
            )}
          />

          {error && (
            <ErrorMessage
              accessibilityLabel="password-recovery-error-message"
              error={{ message: error.evaluatedMessage! }}
              mt={8}
            />
          )}
        </YStack>

        <SubmitButton
          accessibilityLabel="password-recovery-submit-button"
          mode="dark"
          onPress={submit}
          isLoading={isLoading}
        >
          {t('password_recovery_form:submit')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

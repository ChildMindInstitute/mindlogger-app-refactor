import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps, YStack } from '@app/shared/ui/base';
import { ErrorMessage } from '@app/shared/ui/form/ErrorMessage';
import { InputField } from '@app/shared/ui/form/InputField';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

import { MfaRecoveryFormSchema } from '../model/MfaRecoveryFormSchema';

type Props = BoxProps & {
  onRecoverySuccess: (recoveryCode: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
  /** Warning message for remaining attempts */
  attemptsWarning?: string;
};

export const MfaRecoveryForm: FC<Props> = ({
  onRecoverySuccess,
  onBack,
  isLoading = false,
  error,
  attemptsWarning,
  ...props
}) => {
  const { t } = useTranslation();

  const { form, submit } = useAppForm(MfaRecoveryFormSchema, {
    defaultValues: {
      recoveryCode: '',
    },
    onSubmitSuccess: data => {
      executeIfOnline(() => {
        // Pass the recovery code to the parent component
        onRecoverySuccess(data.recoveryCode);
      });
    },
  });

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack gap={96}>
          <YStack gap={24} alignItems="center">
            <YStack gap={8} alignItems="center">
              <Text fontSize={24} lineHeight={32} textAlign="center">
                {t('mfa_recovery:title')}
              </Text>

              <Text
                fontSize={16}
                lineHeight={24}
                letterSpacing={0.5}
                textAlign="center"
                color="$on_surface"
              >
                {t('mfa_recovery:subtitle')}
              </Text>
            </YStack>

            <Box width={300}>
              <InputField
                name="recoveryCode"
                accessibilityLabel="mfa-recovery-code-input"
                placeholder="XXXXX-XXXXX"
                autoCapitalize="characters"
                maxLength={11}
                onChangeText={text => {
                  // Auto-format: add hyphen after 5 characters
                  const cleaned = text.replace(/-/g, '').toUpperCase();
                  if (cleaned.length > 5) {
                    const formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5, 10)}`;
                    form.setValue('recoveryCode', formatted);
                  } else {
                    form.setValue('recoveryCode', cleaned);
                  }
                }}
              />
            </Box>
          </YStack>

          <YStack gap={16} alignItems="center">
            <Box width={300}>
              <SubmitButton
                isLoading={isLoading}
                accessibilityLabel="mfa-recovery-continue-button"
                onPress={() => {
                  submit().catch(console.error);
                }}
                width="100%"
                mode="primary"
              >
                {t('mfa_recovery:continue')}
              </SubmitButton>
            </Box>

            <Box width={300}>
              <SubmitButton
                accessibilityLabel="mfa-recovery-back-button"
                onPress={onBack}
                width="100%"
                mode="secondary"
              >
                {t('mfa_recovery:back')}
              </SubmitButton>
            </Box>

            {error && (
              <ErrorMessage
                mode="light"
                accessibilityLabel="mfa-recovery-error-message"
                error={{ message: error }}
                mt={8}
              />
            )}

            {attemptsWarning && (
              <ErrorMessage
                mode="light"
                accessibilityLabel="mfa-recovery-attempts-warning"
                error={{ message: attemptsWarning }}
                mt={8}
              />
            )}
          </YStack>
        </YStack>
      </FormProvider>
    </Box>
  );
};

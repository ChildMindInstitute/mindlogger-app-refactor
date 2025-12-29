import { FC } from 'react';

import { FormProvider, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useMfaErrorSync } from '@app/features/mfa-verification/lib/useMfaErrorSync';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps, YStack } from '@app/shared/ui/base';
import { Button } from '@app/shared/ui/Button';
import { InputField } from '@app/shared/ui/form/InputField';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

import { MfaRecoveryFormSchema } from '../model/MfaRecoveryFormSchema';

type Props = BoxProps & {
  onRecoverySuccess: (recoveryCode: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
  sessionExpired?: boolean;
  /** Warning message for remaining attempts */
  attemptsWarning?: string;
  /** Callback to clear error when user starts typing */
  onErrorClear?: () => void;
};

export const MfaRecoveryForm: FC<Props> = ({
  onRecoverySuccess,
  onBack,
  isLoading = false,
  error,
  sessionExpired = false,
  attemptsWarning,
  onErrorClear,
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

  // Watch for changes in recovery code
  const recoveryCode = useWatch({
    control: form.control,
    name: 'recoveryCode',
  });

  // Sync API errors with form and handle error clearing
  useMfaErrorSync({
    error,
    attemptsWarning,
    form,
    fieldName: 'recoveryCode',
    onErrorClear,
    fieldValue: recoveryCode,
    clearThreshold: 11,
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
                color="$on_surface_variant"
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
                mode="outlined"
                editable={!sessionExpired}
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
                disabled={sessionExpired}
                accessibilityLabel="mfa-recovery-continue-button"
                onPress={() => {
                  // Clear error before submitting so new errors trigger re-render
                  form.clearErrors('recoveryCode');
                  onErrorClear?.();
                  submit().catch(console.error);
                }}
                width="100%"
                mode="primary"
              >
                {t('mfa_recovery:continue')}
              </SubmitButton>
            </Box>

            <Box width={300}>
              <Button
                onPress={onBack}
                bg="transparent"
                disabled={sessionExpired}
                textProps={{
                  color: '$primary',
                  fontWeight: '400',
                  textAlign: 'center',
                  letterSpacing: 0.15,
                  fontSize: 16,
                  lineHeight: 24,
                }}
                accessibilityLabel="mfa-recovery-back-button"
                h={48}
              >
                {t('mfa_recovery:back')}
              </Button>
            </Box>
          </YStack>
        </YStack>
      </FormProvider>
    </Box>
  );
};

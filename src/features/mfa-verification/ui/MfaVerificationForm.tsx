import { FC, useState, useEffect } from 'react';

import { FormProvider, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAutoSubmit } from '@app/features/mfa-verification/lib/useAutoSubmit';
import { useMfaErrorSync } from '@app/features/mfa-verification/lib/useMfaErrorSync';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { filterDigitsOnly } from '@app/shared/lib/utils/inputFilters';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps, YStack } from '@app/shared/ui/base';
import { Button } from '@app/shared/ui/Button';
import { ErrorMessage } from '@app/shared/ui/form/ErrorMessage';
import { InputField } from '@app/shared/ui/form/InputField';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

import { MfaVerificationFormSchema } from '../model/MfaVerificationFormSchema';

type Props = BoxProps & {
  onVerificationSuccess: (code: string) => void;
  onUseRecoveryCode: () => void;
  isLoading?: boolean;
  error?: string;
  sessionExpired?: boolean;
  /** Warning message for remaining attempts */
  attemptsWarning?: string;
  /** Callback to clear error when user starts typing */
  onErrorClear?: () => void;
};

export const MfaVerificationForm: FC<Props> = ({
  onVerificationSuccess,
  onUseRecoveryCode,
  isLoading = false,
  error,
  sessionExpired = false,
  attemptsWarning,
  onErrorClear,
  ...props
}) => {
  const { t } = useTranslation();

  // Local state for translated session expiry warning
  const [translatedWarning, setTranslatedWarning] = useState<
    string | undefined
  >();

  const { form, submit } = useAppForm(MfaVerificationFormSchema, {
    defaultValues: {
      verificationCode: '',
    },
    onSubmitSuccess: data => {
      executeIfOnline(() => {
        // Pass the verification code to the parent component
        onVerificationSuccess(data.verificationCode);
      });
    },
  });

  // Watch for changes in verification code
  const verificationCode = useWatch({
    control: form.control,
    name: 'verificationCode',
  });

  // Sync API errors with form and handle error clearing
  useMfaErrorSync({
    error,
    attemptsWarning,
    form,
    fieldName: 'verificationCode',
    onErrorClear,
    fieldValue: verificationCode,
    clearThreshold: 6,
  });

  // Clear session expiry warning when user starts typing
  useEffect(() => {
    // Clear session expiry warning when user deletes or modifies code
    if (verificationCode && verificationCode.length < 6 && translatedWarning) {
      setTranslatedWarning(undefined);
    }
  }, [verificationCode, translatedWarning]);

  // Use auto-submit hook
  const { sessionExpiryWarning } = useAutoSubmit({
    verificationCode,
    isLoading,
    sessionExpired,
    form,
    submit,
    onSessionExpiry: warningKey => {
      setTranslatedWarning(t(warningKey));
    },
  });

  // Use translated warning if available, otherwise use the warning from hook
  const displayWarning = translatedWarning || sessionExpiryWarning;

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack gap={96}>
          <YStack gap={24} alignItems="center">
            <YStack gap={8} alignItems="center">
              <Text fontSize={24} lineHeight={32} textAlign="center">
                {t('mfa_verification:title')}
              </Text>

              <Text
                fontSize={16}
                lineHeight={24}
                letterSpacing={0.5}
                textAlign="center"
                color="$on_surface_variant"
              >
                {t('mfa_verification:subtitle')}
              </Text>
            </YStack>

            <Box width={300}>
              <InputField
                name="verificationCode"
                accessibilityLabel="mfa-verification-code-input"
                placeholder={t('mfa_verification:placeholder')}
                keyboardType="number-pad"
                maxLength={6}
                mode="outlined"
                caretHidden={false}
                editable={!sessionExpired}
                filterInput={filterDigitsOnly}
              />
            </Box>

            {displayWarning && !error && !attemptsWarning && (
              <Box width={300} mt={16}>
                <ErrorMessage
                  mode="light"
                  accessibilityLabel="mfa-verification-session-warning"
                  error={{ message: displayWarning }}
                />
              </Box>
            )}
          </YStack>

          <YStack gap={16} alignItems="center">
            <Box width={300}>
              <SubmitButton
                isLoading={isLoading}
                disabled={sessionExpired}
                accessibilityLabel="mfa-verification-verify-button"
                onPress={() => {
                  // Clear error before submitting so new errors trigger re-render
                  form.clearErrors('verificationCode');
                  onErrorClear?.();
                  submit().catch(console.error);
                }}
                width="100%"
                mode="primary"
              >
                {t('mfa_verification:verify')}
              </SubmitButton>
            </Box>

            <Box width={300}>
              <Button
                onPress={onUseRecoveryCode}
                bg="transparent"
                disabled={sessionExpired}
                w="100%"
                px={0}
                textProps={{
                  color: '$primary',
                  fontWeight: '400',
                  textAlign: 'center',
                  letterSpacing: 0.15,
                  fontSize: 16,
                  lineHeight: 24,
                  numberOfLines: 1,
                  adjustsFontSizeToFit: true,
                  minimumFontScale: 0.7,
                }}
                accessibilityLabel="use-recovery-code-link"
              >
                {t('mfa_verification:use_recovery_code')}
              </Button>
            </Box>
          </YStack>
        </YStack>
      </FormProvider>
    </Box>
  );
};

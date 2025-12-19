import { FC, useState } from 'react';

import { FormProvider, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAutoSubmit } from '@app/features/mfa-verification/lib/useAutoSubmit';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps, YStack } from '@app/shared/ui/base';
import { ErrorMessage } from '@app/shared/ui/form/ErrorMessage';
import { InputField } from '@app/shared/ui/form/InputField';
import { Link } from '@app/shared/ui/Link';
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
};

export const MfaVerificationForm: FC<Props> = ({
  onVerificationSuccess,
  onUseRecoveryCode,
  isLoading = false,
  error,
  sessionExpired = false,
  attemptsWarning,
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
                color="$on_surface"
              >
                {t('mfa_verification:subtitle')}
              </Text>
            </YStack>

            <Box width={300}>
              <InputField
                name="verificationCode"
                accessibilityLabel="mfa-verification-code-input"
                placeholder="000000"
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />
            </Box>
          </YStack>

          <YStack gap={16} alignItems="center">
            <Box width={300}>
              <SubmitButton
                isLoading={isLoading}
                accessibilityLabel="mfa-verification-verify-button"
                onPress={() => {
                  submit().catch(console.error);
                }}
                width="100%"
                mode="primary"
              >
                {t('mfa_verification:verify')}
              </SubmitButton>
            </Box>

            {error && (
              <ErrorMessage
                mode="light"
                accessibilityLabel="mfa-verification-error-message"
                error={{ message: error }}
                mt={8}
              />
            )}

            {attemptsWarning && (
              <ErrorMessage
                mode="light"
                accessibilityLabel="mfa-verification-attempts-warning"
                error={{ message: attemptsWarning }}
                mt={8}
              />
            )}

            {displayWarning && !error && !attemptsWarning && (
              <ErrorMessage
                mode="light"
                accessibilityLabel="mfa-verification-session-warning"
                error={{ message: displayWarning }}
                mt={8}
              />
            )}

            <Link
              textDecorationLine="underline"
              accessibilityLabel="use-recovery-code-link"
              onPress={onUseRecoveryCode}
              mt={16}
            >
              {t('mfa_verification:use_recovery_code')}
            </Link>
          </YStack>
        </YStack>
      </FormProvider>
    </Box>
  );
};

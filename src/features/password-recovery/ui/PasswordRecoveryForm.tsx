import { FC, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import { FormProvider, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useBanners } from '@app/entities/banner/lib/hooks/useBanners';
import { useApprovePasswordRecoveryMutation } from '@app/entities/identity/api/hooks/useApprovePasswordRecoveryMutation';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { useFormChanges } from '@app/shared/lib/hooks/useFormChanges';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps, YStack } from '@app/shared/ui/base';
import { ErrorMessage } from '@app/shared/ui/form/ErrorMessage';
import { InputField } from '@app/shared/ui/form/InputField';
import { PasswordRequirementsChecklist } from '@app/shared/ui/form/PasswordRequirementsChecklist';
import { EyeIcon, EyeSlashIcon } from '@app/shared/ui/icons';
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
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isFirstTimeFocused, setIsFirstTimeFocused] = useState(true);
  const [shouldHideError, setShouldHideError] = useState(true);

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
    criteriaMode: 'all',
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
    shouldUseNativeValidation: false,
  });

  const newPasswordValue = String(
    useWatch({ control: form.control, name: 'newPassword' }) ?? '',
  );

  useFormChanges({ form, onInputChange: () => reset() });

  const ShowPasswordIcon = isPasswordHidden ? EyeSlashIcon : EyeIcon;

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack space={8} mb={40}>
          <InputField
            aria-label="password-recovery-new-password-input"
            secureTextEntry={isPasswordHidden}
            name="newPassword"
            placeholder={t('password_recovery_form:new_password_placeholder')}
            hideError={isNewPasswordFocused || shouldHideError}
            onFocus={() => setIsNewPasswordFocused(true)}
            onBlur={() => {
              setIsNewPasswordFocused(false);
              setIsFirstTimeFocused(false);
            }}
            rightIcon={
              <TouchableWithoutFeedback
                onPress={() => setIsPasswordHidden(!isPasswordHidden)}
              >
                <ShowPasswordIcon size={18} color={palette.on_surface} />
              </TouchableWithoutFeedback>
            }
          />

          <PasswordRequirementsChecklist
            isFirstTimeFocused={isFirstTimeFocused}
            fieldName="newPassword"
            isPasswordFocused={isNewPasswordFocused}
          />

          <InputField
            aria-label="password-recovery-confirm-password-input"
            secureTextEntry={isPasswordHidden}
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
          onPress={() => {
            if (!newPasswordValue) {
              setShouldHideError(false);
            }
            submit();
          }}
          isLoading={isLoading}
        >
          {t('password_recovery_form:submit')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

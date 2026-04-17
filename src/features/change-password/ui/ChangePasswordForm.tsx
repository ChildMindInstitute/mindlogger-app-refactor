import React, { FC, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useBanners } from '@app/entities/banner/lib/hooks/useBanners';
import { useChangePasswordMutation } from '@app/entities/identity/api/hooks/useChangePasswordMutation';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { useFormChanges } from '@app/shared/lib/hooks/useFormChanges';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps, YStack } from '@app/shared/ui/base';
import { InputField } from '@app/shared/ui/form/InputField';
import { PasswordRequirementsChecklist } from '@app/shared/ui/form/PasswordRequirementsChecklist';
import { EyeIcon, EyeSlashIcon } from '@app/shared/ui/icons';
import { SubmitButton } from '@app/shared/ui/SubmitButton';

import { ChangePasswordFormSchema } from '../model/ChangePasswordFormSchema';

type Props = BoxProps & {
  onChangePasswordSuccess: () => void;
};

export const ChangePasswordForm: FC<Props> = props => {
  const { t } = useTranslation();
  const { addSuccessBanner, addErrorBanner } = useBanners();
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isFirstTimeFocused, setIsFirstTimeFocused] = useState(true);

  const {
    mutate: changePassword,
    isLoading,
    reset,
  } = useChangePasswordMutation({
    onSuccess: () => {
      props.onChangePasswordSuccess();
      addSuccessBanner(t('auth:password_updated'));
    },
    onError: error => {
      addErrorBanner(error.evaluatedMessage ?? '');
    },
  });

  const ShowPasswordIcon = isPasswordHidden ? EyeSlashIcon : EyeIcon;

  const { form, submit } = useAppForm(ChangePasswordFormSchema, {
    defaultValues: {
      prev_password: '',
      password: '',
    },
    criteriaMode: 'all',
    shouldUseNativeValidation: false,
    onSubmitSuccess: data => {
      executeIfOnline(() => changePassword(data));
    },
  });

  useFormChanges({ form, onInputChange: () => reset() });

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack space={8} mb={40}>
          <InputField
            aria-label="change-password-prev-password-input"
            secureTextEntry
            name="prev_password"
            placeholder={t('change_pass_form:cur_pass_placeholder')}
          />

          <InputField
            aria-label="change-password-password-input"
            secureTextEntry={isPasswordHidden}
            name="password"
            placeholder={t('change_pass_form:new_pass_placeholder')}
            onFocus={() => setIsPasswordFocus(true)}
            onBlur={() => {
              setIsPasswordFocus(false);
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
            isPasswordFocused={isPasswordFocus}
            isFirstTimeFocused={isFirstTimeFocused}
          />
        </YStack>

        <SubmitButton
          accessibilityLabel="change-password-submit-button"
          mode="primary"
          onPress={submit}
          isLoading={isLoading}
        >
          {t('change_pass_form:update')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

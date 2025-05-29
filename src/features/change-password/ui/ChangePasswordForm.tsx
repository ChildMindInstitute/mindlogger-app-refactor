import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useBanners } from '@app/entities/banner/lib/hooks/useBanners';
import { useChangePasswordMutation } from '@app/entities/identity/api/hooks/useChangePasswordMutation';
import { colors } from '@app/shared/lib/constants/colors';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { useFormChanges } from '@app/shared/lib/hooks/useFormChanges';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps, YStack } from '@app/shared/ui/base';
import { ErrorMessage } from '@app/shared/ui/form/ErrorMessage';
import { InputField } from '@app/shared/ui/form/InputField';
import { SubmitButton } from '@app/shared/ui/SubmitButton';

import { ChangePasswordFormSchema } from '../model/ChangePasswordFormSchema';

type Props = BoxProps & {
  onChangePasswordSuccess: () => void;
};

export const ChangePasswordForm: FC<Props> = props => {
  const { t } = useTranslation();
  const { addSuccessBanner } = useBanners();

  const {
    mutate: changePassword,
    error,
    isLoading,
    reset,
  } = useChangePasswordMutation({
    onSuccess: () => {
      props.onChangePasswordSuccess();
      addSuccessBanner(t('auth:password_updated'));
    },
  });

  const { form, submit } = useAppForm(ChangePasswordFormSchema, {
    defaultValues: {
      prev_password: '',
      password: '',
    },
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
            mode="dark"
            accessibilityLabel="change-password-prev-password-input"
            backgroundColor="transparent"
            placeholderTextColor={colors.grey3}
            secureTextEntry
            name="prev_password"
            placeholder={t('change_pass_form:cur_pass_placeholder')}
          />

          <InputField
            mode="dark"
            backgroundColor="transparent"
            accessibilityLabel="change-password-password-input"
            placeholderTextColor={colors.grey3}
            secureTextEntry
            name="password"
            placeholder={t('change_pass_form:new_pass_placeholder')}
          />

          {error && (
            <ErrorMessage
              accessibilityLabel="change-password-error-message"
              error={{ message: error.evaluatedMessage! }}
              mt={8}
            />
          )}
        </YStack>

        <SubmitButton
          accessibilityLabel="change-password-submit-button"
          mode="dark"
          onPress={submit}
          isLoading={isLoading}
        >
          {t('change_pass_form:update')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

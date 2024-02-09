import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useChangePasswordMutation } from '@app/entities/identity';
import {
  colors,
  executeIfOnline,
  useAppForm,
  useFormChanges,
  useToast,
} from '@shared/lib';
import { SubmitButton, YStack, Box, BoxProps } from '@shared/ui';
import { ErrorMessage, InputField } from '@shared/ui/form';

import { ChangePasswordFormSchema } from '../model';

type Props = BoxProps & {
  onChangePasswordSuccess: () => void;
};

const ChangePasswordForm: FC<Props> = props => {
  const { t } = useTranslation();
  const toast = useToast();

  const {
    mutate: changePassword,
    error,
    isLoading,
    reset,
  } = useChangePasswordMutation({
    onSuccess: () => {
      props.onChangePasswordSuccess();
      toast.show(t('auth:password_updated'));
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

export default ChangePasswordForm;

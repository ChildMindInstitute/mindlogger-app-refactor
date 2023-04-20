import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';

import { useChangePasswordMutation } from '@app/entities/identity';
import { colors, useAppForm, useFormChanges } from '@shared/lib';
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
      toast.show('Password updated'); // @todo add correct translations
    },
  });

  const { form, submit } = useAppForm(ChangePasswordFormSchema, {
    defaultValues: {
      prev_password: '',
      password: '',
    },
    onSubmitSuccess: data => {
      changePassword(data);
    },
  });

  useFormChanges({ form, onInputChange: () => reset() });

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack space={8} mb={40}>
          <InputField
            mode="dark"
            backgroundColor="transparent"
            placeholderTextColor={colors.grey3}
            secureTextEntry
            name="prev_password"
            placeholder={t('change_pass_form:cur_pass_placeholder')}
          />

          <InputField
            mode="dark"
            backgroundColor="transparent"
            placeholderTextColor={colors.grey3}
            secureTextEntry
            name="password"
            placeholder={t('change_pass_form:new_pass_placeholder')}
          />

          {error && (
            <ErrorMessage error={{ message: error.evaluatedMessage! }} mt={8} />
          )}
        </YStack>

        <SubmitButton mode="dark" onPress={submit} isLoading={isLoading}>
          {t('change_pass_form:update')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

export default ChangePasswordForm;

import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useChangePasswordMutation } from '@app/entities/identity';
import { useAppForm } from '@shared/lib';
import { SubmitButton, YStack, Box, BoxProps } from '@shared/ui';
import { ErrorMessage, InputField } from '@shared/ui/form';

import { ChangePasswordFormSchema } from '../model';

type Props = BoxProps & {
  onChangePasswordSuccess: () => void;
};

const ChangePasswordForm: FC<Props> = props => {
  const { t } = useTranslation();

  const {
    mutate: changePassword,
    error,
    isLoading,
  } = useChangePasswordMutation({
    onSuccess: () => {
      props.onChangePasswordSuccess();
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

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack space={8} mb={40}>
          <InputField
            mode="dark"
            secureTextEntry
            name="prev_password"
            placeholder={t('change_pass_form:cur_pass_placeholder')}
          />

          <InputField
            mode="dark"
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

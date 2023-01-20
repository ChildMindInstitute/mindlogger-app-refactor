import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppForm } from '@shared/lib';
import { SubmitButton, YStack, Box, BoxProps } from '@shared/ui';
import { InputField } from '@shared/ui/form';

import { ChangePasswordFormSchema } from '../model';

const ChangePasswordForm: FC<BoxProps> = props => {
  const { t } = useTranslation();
  const { form, submit } = useAppForm(ChangePasswordFormSchema, {
    defaultValues: {
      oldPassword: '',
      password: '',
    },
    onSubmitSuccess: data => {
      console.log(data);
    },
  });

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack space={8} mb={40}>
          <InputField
            mode="dark"
            secureTextEntry
            name="oldPassword"
            placeholder={t('change_pass_form:cur_pass_placeholder')}
          />

          <InputField
            mode="dark"
            secureTextEntry
            name="password"
            placeholder={t('change_pass_form:new_pass_placeholder')}
          />
        </YStack>

        <SubmitButton mode="dark" onPress={submit}>
          {t('change_pass_form:update')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

export default ChangePasswordForm;

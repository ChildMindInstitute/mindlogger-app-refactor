import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppForm } from '@shared/lib';
import { Button, YStack, Box, BoxProps } from '@shared/ui';
import { InputField } from '@shared/ui/form';

import { ForgotPasswordFormSchema } from '../model';

const ForgotPasswordForm: FC<BoxProps> = props => {
  const { t } = useTranslation();
  const { form, submit } = useAppForm(ForgotPasswordFormSchema, {
    defaultValues: {
      email: '',
    },
    onSubmitSuccess: data => {
      console.log(data);
    },
  });

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack mb={40}>
          <InputField name="email" placeholder={t('auth:email_address')} />
        </YStack>

        <Button variant="light" alignSelf="center" onPress={submit}>
          {t('forgot_pass_form:reset_pass')}
        </Button>
      </FormProvider>
    </Box>
  );
};

export default ForgotPasswordForm;

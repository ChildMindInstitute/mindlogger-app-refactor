import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppForm } from '@shared/lib';
import { Button, YStack, Box, BoxProps } from '@shared/ui';
import { InputField } from '@shared/ui/form';

import { LoginFormSchema } from '../model';

const LoginForm: FC<BoxProps> = props => {
  const { t } = useTranslation();
  const { form, submit } = useAppForm(LoginFormSchema, {
    defaultValues: {
      email: '',
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
            name="email"
            placeholder={t('login_form:email_placeholder')}
          />

          <InputField
            secureTextEntry
            name="password"
            placeholder={t('auth:password')}
          />
        </YStack>

        <Button variant="light" alignSelf="center" onPress={submit}>
          {t('login_form:login')}
        </Button>
      </FormProvider>
    </Box>
  );
};

export default LoginForm;

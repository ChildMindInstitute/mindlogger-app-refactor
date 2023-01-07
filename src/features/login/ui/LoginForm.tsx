import { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, YStack, Box, BoxProps } from '@shared/ui';
import { InputField } from '@shared/ui/form';

import { LoginFormSchema, TLoginForm } from '../model';

const LoginForm: FC<BoxProps> = props => {
  const { t } = useTranslation();
  const methods = useForm<TLoginForm>({
    resolver: zodResolver(LoginFormSchema),
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<TLoginForm> = data => console.log(data);

  return (
    <Box {...props}>
      <FormProvider {...methods}>
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

        <Button
          variant="white"
          alignSelf="center"
          onPress={handleSubmit(onSubmit)}>
          {t('login_form:login')}
        </Button>
      </FormProvider>
    </Box>
  );
};

export default LoginForm;

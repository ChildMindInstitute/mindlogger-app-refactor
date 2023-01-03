import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { VStack, Button } from '@shared/ui';
import { InputField } from '@shared/ui/form';
import { LoginFormSchema, TLoginForm } from '../model';

const LoginForm = () => {
  const { t } = useTranslation();
  const methods = useForm<TLoginForm>({
    resolver: zodResolver(LoginFormSchema),
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<TLoginForm> = data => console.log(data);

  return (
    <FormProvider {...methods}>
      <VStack w={'75%'}>
        <InputField name="email" placeholder={t('auth:email')} />
        <InputField secureTextEntry name="password" placeholder={t('auth:password')} />
      </VStack>
      <Button onPress={handleSubmit(onSubmit)}>{t('login_form:login')}</Button>
    </FormProvider>
  );
};

export { LoginForm };

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
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
      <VStack>
        <InputField name="email" placeholder={t('auth:email')} />

        <InputField
          secureTextEntry
          name="password"
          placeholder={t('auth:password')}
        />
      </VStack>

      <Button alignSelf="center" onPress={handleSubmit(onSubmit)}>
        {t('login_form:login')}
      </Button>
    </FormProvider>
  );
};

export { LoginForm };

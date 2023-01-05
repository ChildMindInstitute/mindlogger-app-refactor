import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { VStack, Button } from '@shared/ui';
import { InputField } from '@shared/ui/form';

import { ForgotPasswordFormSchema, TForgotPasswordForm } from '../model';

const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const methods = useForm<TForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<TForgotPasswordForm> = data =>
    console.log(data);

  return (
    <FormProvider {...methods}>
      <VStack>
        <InputField name="email" placeholder={t('auth:email')} />
      </VStack>

      <Button alignSelf="center" onPress={handleSubmit(onSubmit)}>
        {t('forgot_pass_form:reset_pass')}
      </Button>
    </FormProvider>
  );
};

export { ForgotPasswordForm };

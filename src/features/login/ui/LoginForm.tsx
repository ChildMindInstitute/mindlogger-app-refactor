import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { VStack, Button } from '@shared/ui';
import { InputField } from '@shared/ui/form';
import { LoginFormSchema, TLoginForm } from '../model';

const LoginForm = () => {
  const methods = useForm<TLoginForm>({
    resolver: zodResolver(LoginFormSchema),
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<TLoginForm> = data => console.log(data);

  return (
    <FormProvider {...methods}>
      <VStack w={'75%'}>
        <InputField name="email" placeholder="Email address" />
        <InputField secureTextEntry name="password" placeholder="Password" />
      </VStack>
      <Button onPress={handleSubmit(onSubmit)}>LOGIN</Button>
    </FormProvider>
  );
};

export { LoginForm };

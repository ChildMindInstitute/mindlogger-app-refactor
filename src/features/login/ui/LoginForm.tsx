import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VStack, Button, Box } from '@shared/ui';
import { InputField } from '@shared/ui/form';
import { loginFormSchema } from '../model';

type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<FormValues> = data => console.log(data);

  return (
    <FormProvider {...methods}>
      <VStack w={'75%'}>
        <InputField name="email" placeholder="Email address" />
        <InputField name="password" placeholder="Password" />
        <Box alignItems={'center'}>
          <Button onPress={handleSubmit(onSubmit)}>LOGIN</Button>
        </Box>
      </VStack>
    </FormProvider>
  );
};

export { LoginForm };

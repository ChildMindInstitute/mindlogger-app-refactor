import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { VStack, Button, Text, Pressable, HStack } from '@shared/ui';
import { InputField, CheckBoxField } from '@shared/ui/form';

import { SignUpFormSchema, TSignUpForm } from '../model';

const SignUpForm = () => {
  const { t } = useTranslation();
  const methods = useForm<TSignUpForm>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      terms: false,
    },
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<TSignUpForm> = data =>
    console.log('Sign-up data: ', data);

  return (
    <FormProvider {...methods}>
      <VStack>
        <InputField name="email" placeholder={t('auth:email')} />

        <InputField
          name="display_name"
          placeholder={t('sign_up_form:display_name_placeholder')}
        />

        <InputField
          secureTextEntry
          name="password"
          placeholder={t('auth:password')}
        />

        <CheckBoxField value="" name="terms">
          <HStack>
            <Text>{t('auth:i_agree')}</Text>

            <Pressable onPress={() => {}}>
              <Text ml={1}>{t('auth:terms_of_service')}</Text>
            </Pressable>
          </HStack>
        </CheckBoxField>
      </VStack>

      <Button alignSelf="center" onPress={handleSubmit(onSubmit)}>
        {t('sign_up_form:sign_up')}
      </Button>
    </FormProvider>
  );
};

export { SignUpForm };

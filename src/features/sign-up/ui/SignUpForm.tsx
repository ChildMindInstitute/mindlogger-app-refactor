import { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import colors from '@app/shared/lib/constants/colors';
import { Button, Text, Box, BoxProps, YStack, XStack } from '@shared/ui';
import { InputField, CheckBoxField } from '@shared/ui/form';

import { SignUpFormSchema, TSignUpForm } from '../model';

const SignUpForm: FC<BoxProps> = props => {
  const { t } = useTranslation();
  const methods = useForm<TSignUpForm>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      terms: false,
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<TSignUpForm> = data =>
    console.log('Sign-up data: ', data);

  return (
    <Box {...props}>
      <FormProvider {...methods}>
        <YStack>
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

          <YStack mt={26} mb={46}>
            <CheckBoxField value="" name="terms">
              <XStack ml={16}>
                <Text color="white" fontSize={17} lineHeight={22}>
                  {t('auth:i_agree')}
                </Text>

                <Text
                  ml={3}
                  lineHeight={22}
                  fontSize={17}
                  color={colors.white}
                  textDecorationLine="underline">
                  {t('auth:terms_of_service')}
                </Text>
              </XStack>
            </CheckBoxField>
          </YStack>
        </YStack>

        <Button
          variant="light"
          alignSelf="center"
          onPress={handleSubmit(onSubmit)}>
          {t('sign_up_form:sign_up')}
        </Button>
      </FormProvider>
    </Box>
  );
};

export { SignUpForm };

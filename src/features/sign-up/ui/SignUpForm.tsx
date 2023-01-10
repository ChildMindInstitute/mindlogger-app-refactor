import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppForm } from '@app/shared/lib';
import { Button, Text, Box, BoxProps, YStack, XStack } from '@shared/ui';
import { InputField, CheckBoxField } from '@shared/ui/form';

import { SignUpFormSchema } from '../model';

const SignUpForm: FC<BoxProps> = props => {
  const { t } = useTranslation();

  const { form, submit } = useAppForm(SignUpFormSchema, {
    defaultValues: {
      terms: false,
      email: '',
      password: '',
    },
    onSubmitSuccess: data => {
      console.log('Sign-up data: ', data);
    },
  });

  return (
    <Box {...props}>
      <FormProvider {...form}>
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
                <Text color="$secondary" fontSize={17} lineHeight={22}>
                  {t('auth:i_agree')}
                </Text>

                <Text
                  ml={3}
                  lineHeight={22}
                  fontSize={17}
                  color="$secondary"
                  textDecorationLine="underline">
                  {t('auth:terms_of_service')}
                </Text>
              </XStack>
            </CheckBoxField>
          </YStack>
        </YStack>

        <Button variant="light" alignSelf="center" onPress={submit}>
          {t('sign_up_form:sign_up')}
        </Button>
      </FormProvider>
    </Box>
  );
};

export { SignUpForm };

/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';
import { Linking } from 'react-native';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppForm } from '@app/shared/lib';
import { IdentityModel } from '@entities/identity';
import { Text, Box, BoxProps, YStack, XStack, SubmitButton } from '@shared/ui';
import { InputField, CheckBoxField, ErrorMessage } from '@shared/ui/form';

import { SignUpFormSchema } from '../model';

type Props = BoxProps & {
  onLoginSuccess: () => void;
};

const SignUpForm: FC<Props> = props => {
  const { t } = useTranslation();

  const {
    isLoading,
    error,
    mutate: signUp,
  } = IdentityModel.useRegistrationMutation(props.onLoginSuccess);

  const { form, submit } = useAppForm(SignUpFormSchema, {
    defaultValues: {
      terms: false,
      email: '',
      password: '',
    },
    onSubmitSuccess: data => {
      signUp({
        email: data.email,
        fullName: data.display_name,
        password: data.password,
      });
    },
  });

  const navigateToTerms = () => {
    Linking.openURL('https://mindlogger.org/terms');
  };

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

          {error && (
            <ErrorMessage
              mode="light"
              mt={8}
              error={{ message: error?.evaluatedMessage! }}
            />
          )}

          <YStack mt={26} mb={46}>
            <CheckBoxField name="terms">
              <XStack ml={16}>
                <Text color="$secondary" fontSize={17} lineHeight={22}>
                  {t('auth:i_agree')}
                </Text>

                <Text
                  ml={3}
                  lineHeight={22}
                  fontSize={17}
                  color="$secondary"
                  textDecorationLine="underline"
                  onPress={navigateToTerms}>
                  {t('auth:terms_of_service')}
                </Text>
              </XStack>
            </CheckBoxField>
          </YStack>
        </YStack>

        <SubmitButton
          isLoading={isLoading}
          onPress={submit}
          buttonStyle={{ alignSelf: 'center', paddingHorizontal: 56 }}>
          {t('sign_up_form:sign_up')}
        </SubmitButton>
      </FormProvider>
    </Box>
  );
};

export { SignUpForm };

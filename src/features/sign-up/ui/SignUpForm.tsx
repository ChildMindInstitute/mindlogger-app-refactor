/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { IdentityModel } from '@app/entities/identity';
import { useAppForm } from '@app/shared/lib';
import {
  Text,
  Box,
  BoxProps,
  YStack,
  XStack,
  ProgressButton,
} from '@shared/ui';
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

  console.log('error su!', JSON.stringify(error?.evaluatedMessage));

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
                  textDecorationLine="underline">
                  {t('auth:terms_of_service')}
                </Text>
              </XStack>
            </CheckBoxField>
          </YStack>
        </YStack>

        <ProgressButton
          isLoading={isLoading}
          onClick={submit}
          text={t('sign_up_form:sign_up')}
          variant="light"
          buttonStyle={{ width: 172, alignSelf: 'center' }}
          spinnerColor="tertiary"
        />
      </FormProvider>
    </Box>
  );
};

export { SignUpForm };

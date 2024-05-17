/* eslint-disable react-native/no-inline-styles */
import { FC, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isTablet } from 'react-native-device-info';

import { executeIfOnline, useAppForm, colors } from '@app/shared/lib';
import { Box, BoxProps, YStack, SubmitButton } from '@shared/ui';
import { InputField, ErrorMessage } from '@shared/ui/form';
import { EyeIcon, EyeSlashIcon } from '@shared/ui/icons';

import SignUpPasswordRequirements from './SignUpPasswordRequirements';
import { SignUpModel } from '../';
import { SignUpFormSchema } from '../validation';

type Props = BoxProps & {
  onLoginSuccess: () => void;
};

const SignUpForm: FC<Props> = props => {
  const { t } = useTranslation();
  const [isPasswordHidden, setPasswordHidden] = useState(true);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);

  const {
    isLoading,
    error,
    mutate: signUp,
  } = SignUpModel.useRegistrationMutation(props.onLoginSuccess);

  const { form, submit } = useAppForm(SignUpFormSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmitSuccess: data => {
      executeIfOnline(() => signUp(data));
    },
    criteriaMode: 'all',
    shouldUseNativeValidation: false,
  });

  const ShowPasswordIcon = isPasswordHidden ? EyeSlashIcon : EyeIcon;

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <YStack space={isTablet() ? 10 : 22}>
          <InputField
            name="email"
            accessibilityLabel="signup-email-input"
            placeholder={t('auth:email')}
          />

          <InputField
            name="firstName"
            accessibilityLabel="signup-first-name-input"
            placeholder={t('sign_up_form:first_name')}
          />

          <InputField
            name="lastName"
            accessibilityLabel="signup-last-name-input"
            placeholder={t('sign_up_form:last_name')}
          />

          <InputField
            name="password"
            accessibilityLabel="signup-password-input"
            placeholder={t('auth:password')}
            secureTextEntry={isPasswordHidden}
            rightIcon={
              <TouchableWithoutFeedback
                onPress={() => setPasswordHidden(!isPasswordHidden)}
              >
                <ShowPasswordIcon size={24} color={colors.white} />
              </TouchableWithoutFeedback>
            }
            hideError={isPasswordFocus}
            onFocus={() => setIsPasswordFocus(true)}
            onBlur={() => setIsPasswordFocus(false)}
          />

          {error && (
            <ErrorMessage
              mode="light"
              accessibilityLabel="signup-error-message"
              mt={8}
              error={{ message: error?.evaluatedMessage! }}
            />
          )}

          {isPasswordFocus && <SignUpPasswordRequirements />}

          <SubmitButton
            isLoading={isLoading}
            onPress={submit}
            accessibilityLabel="sign_up-button"
            borderRadius={30}
            width="100%"
            bg="$lighterGrey4"
            mt={isTablet() ? 110 : 50}
            textProps={{
              fontSize: 14,
              color: 'black',
            }}
            buttonStyle={{
              alignSelf: 'center',
              paddingVertical: isTablet() ? 13 : 16,
            }}
          >
            {t('sign_up_form:sign_up')}
          </SubmitButton>
        </YStack>
      </FormProvider>
    </Box>
  );
};

export { SignUpForm };

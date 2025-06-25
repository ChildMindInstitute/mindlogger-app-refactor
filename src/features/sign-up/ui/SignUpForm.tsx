import { FC, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { palette } from '@app/shared/lib/constants/palette';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { executeIfOnline } from '@app/shared/lib/utils/networkHelpers';
import { Box, BoxProps } from '@app/shared/ui/base';
import { ErrorMessage } from '@app/shared/ui/form/ErrorMessage';
import { InputField } from '@app/shared/ui/form/InputField';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { EyeIcon, EyeSlashIcon } from '@shared/ui/icons';

import { SignUpPasswordRequirements } from './SignUpPasswordRequirements';
import { useRegistrationMutation } from '../model/hooks/useRegistrationMutation';
import { SignUpFormSchema } from '../validation/SignUpFormSchema';

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
  } = useRegistrationMutation(props.onLoginSuccess);

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
        <Animated.View layout={LinearTransition} style={{ gap: 12 }}>
          <InputField
            name="email"
            keyboardType="email-address"
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
                <ShowPasswordIcon size={18} color={palette.on_surface} />
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
            mt="$9"
            mb="$4"
          >
            {t('sign_up_form:sign_up')}
          </SubmitButton>
        </Animated.View>
      </FormProvider>
    </Box>
  );
};

export { SignUpForm };

import { FC } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import {
  RouteProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isTablet } from 'react-native-device-info';

import { usePasswordRecoveryHealthCheckQuery } from '@app/entities/identity/api/hooks/usePasswordRecoveryHealthCheckQuery';
import { PasswordRecoveryForm } from '@app/features/password-recovery/ui/PasswordRecoveryForm';
import { palette } from '@app/shared/lib/constants/palette';
import { Box, YStack } from '@app/shared/ui/base';
import { Spinner } from '@app/shared/ui/Spinner';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

import { RootStackParamList } from '../config/types';

type PasswordRecoveryScreenProps = {
  route: RouteProp<RootStackParamList, 'PasswordRecovery'>;
};

export const PasswordRecoveryScreen: FC<PasswordRecoveryScreenProps> = ({
  route,
}) => {
  const { dispatch } = useNavigation();
  const { t } = useTranslation();
  const { email, key } = route.params;

  const { isError, isLoading } = usePasswordRecoveryHealthCheckQuery(
    email,
    key,
  );

  return (
    <>
      {isError ? (
        <YStack jc="center" ai="center" flex={1} px={isTablet() ? '$20' : 0}>
          <Box px="$8">
            <Text textAlign="center">
              {t('password_recovery_form:invalid_password_reset_link')}
            </Text>

            <Text textAlign="center">
              {t('password_recovery_form:click_to_reset_password')}
            </Text>

            <SubmitButton
              accessibilityLabel="link-to-forgot-password"
              onPress={() => dispatch(StackActions.replace('ForgotPassword'))}
              mt={32}
            >
              {t('password_recovery_form:forgot_password')}
            </SubmitButton>
          </Box>
        </YStack>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Box
            flex={1}
            pt="$5"
            px={isTablet() ? '$20' : 0}
            mt="$2"
            jc="flex-start"
          >
            <PasswordRecoveryForm
              px="$8"
              onPasswordRecoverySuccess={() =>
                dispatch(StackActions.replace('Login'))
              }
              email={email}
              resetKey={key}
            />
          </Box>
        </TouchableWithoutFeedback>
      )}

      <Spinner
        withOverlay
        overlayColor={palette.surface}
        isVisible={isLoading}
      />
    </>
  );
};

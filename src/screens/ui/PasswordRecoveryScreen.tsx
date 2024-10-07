import { FC } from 'react';
import { StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native';

import {
  RouteProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isTablet } from 'react-native-device-info';

import { usePasswordRecoveryHealthCheckQuery } from '@app/entities/identity/api/hooks/usePasswordRecoveryHealthCheckQuery';
import { PasswordRecoveryForm } from '@app/features/password-recovery/ui/PasswordRecoveryForm';
import { Box } from '@app/shared/ui/base';
import { Button } from '@app/shared/ui/Button';
import { Center } from '@app/shared/ui/Center';
import { Spinner } from '@app/shared/ui/Spinner';
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

  if (isLoading) {
    return (
      <Center flex={1} bg="$secondary">
        <Spinner size={100} />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center flex={1} bg="$secondary" px={isTablet() ? '$17' : '$8'}>
        <Text textAlign="center" fontSize={15} width="100%">
          {t('password_recovery_form:invalid_password_reset_link')}
        </Text>

        <Text textAlign="center" fontSize={15} width="100%">
          {t('password_recovery_form:click_to_reset_password')}
        </Text>

        <Button
          accessibilityLabel="link-to-forgot-password"
          onPress={() => dispatch(StackActions.replace('ForgotPassword'))}
          py={16}
          mt={16}
        >
          {t('password_recovery_form:forgot_password')}
        </Button>
      </Center>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} bg="$secondary" pt="$5">
        <StatusBar />

        <Box flex={1} jc="flex-start">
          <PasswordRecoveryForm
            px="$8"
            mt="$2"
            onPasswordRecoverySuccess={() =>
              dispatch(StackActions.replace('Login'))
            }
            email={route.params.email}
            resetKey={route.params.key}
          />
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

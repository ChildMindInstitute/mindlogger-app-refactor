import { FC } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { isTablet } from 'react-native-device-info';

import { ForgotPasswordForm } from '@app/features/forgot-password/ui/ForgotPasswordForm';
import { YStack } from '@app/shared/ui/base';

export const ForgotPasswordScreen: FC = () => {
  const { navigate } = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack flex={1} px={isTablet() ? '$20' : 0} mt="$6">
        <ForgotPasswordForm
          px="$8"
          onRecoverySuccess={() => navigate('Login')}
        />
      </YStack>
    </TouchableWithoutFeedback>
  );
};

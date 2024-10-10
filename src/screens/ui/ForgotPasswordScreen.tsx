import { FC } from 'react';
import { StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { ForgotPasswordForm } from '@app/features/forgot-password/ui/ForgotPasswordForm';
import { Box, YStack } from '@app/shared/ui/base';

export const ForgotPasswordScreen: FC = () => {
  const { navigate } = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} bg="$primary">
        <StatusBar />

        <Box flex={1} mt="$6">
          <YStack>
            <ForgotPasswordForm
              px="$8"
              onRecoverySuccess={() => navigate('Login')}
            />
          </YStack>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

import { FC } from 'react';
import { StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { ForgotPasswordForm } from '@features/forgot-password';
import { YStack, Box } from '@shared/ui';

const ForgotPasswordScreen: FC = () => {
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

export default ForgotPasswordScreen;

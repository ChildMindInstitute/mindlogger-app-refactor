import { FC } from 'react';
import { StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { ChangePasswordForm } from '@features/change-password/index';
import { Box } from '@shared/ui';

const LoginScreen: FC = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} bg="$secondary" pt="$5">
        <StatusBar />

        <Box flex={1} jc="flex-start">
          <ChangePasswordForm px="$8" />
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

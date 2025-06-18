import { FC } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { isTablet } from 'react-native-device-info';

import { ChangePasswordForm } from '@app/features/change-password/ui/ChangePasswordForm';
import { Box } from '@app/shared/ui/base';

export const ChangePasswordScreen: FC = () => {
  const { navigate } = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} mt="$7" px={isTablet() ? '$20' : 0} jc="flex-start">
        <ChangePasswordForm
          px="$8"
          onChangePasswordSuccess={() => navigate('Settings')}
        />
      </Box>
    </TouchableWithoutFeedback>
  );
};

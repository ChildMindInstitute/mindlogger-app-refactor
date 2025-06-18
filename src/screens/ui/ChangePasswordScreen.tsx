import { FC } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { ChangePasswordForm } from '@app/features/change-password/ui/ChangePasswordForm';
import { Box } from '@app/shared/ui/base';

export const ChangePasswordScreen: FC = () => {
  const { navigate } = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} pt="$5">
        <Box flex={1} jc="flex-start">
          <ChangePasswordForm
            px="$8"
            mt="$2"
            onChangePasswordSuccess={() => navigate('Settings')}
          />
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

import { FC } from 'react';

import { useNavigation } from '@react-navigation/native';
import { isTablet } from 'react-native-device-info';

import { ChangePasswordForm } from '@app/features/change-password/ui/ChangePasswordForm';
import { Box } from '@app/shared/ui/base';
import { ScrollView } from '@app/shared/ui/ScrollView';

export const ChangePasswordScreen: FC = () => {
  const { navigate } = useNavigation();

  return (
    <Box flex={1} mt="$7" px={isTablet() ? '$20' : 0} jc="flex-start">
      <ScrollView
        flex={1}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ChangePasswordForm
          px="$8"
          onChangePasswordSuccess={() => navigate('Settings')}
        />
      </ScrollView>
    </Box>
  );
};

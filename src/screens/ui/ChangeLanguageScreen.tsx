import { FC } from 'react';
import { StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { ChangeLanguageSelector } from '@app/features/change-language/ui/ChangeLanguageSelector';
import { Box } from '@app/shared/ui/base';

export const ChangeLanguageScreen: FC = () => {
  const navigation = useNavigation();

  const onLanguageChanged = () => {
    navigation.goBack();
  };

  return (
    <Box flex={1} bg="$white">
      <StatusBar />

      <Box flex={1}>
        <ChangeLanguageSelector onLanguageChanged={onLanguageChanged} px="$2" />
      </Box>
    </Box>
  );
};

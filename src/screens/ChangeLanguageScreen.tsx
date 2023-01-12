import { FC } from 'react';
import { StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { ChangeLanguageSelector } from '@features/change-language';
import { Box } from '@shared/ui';

const ChangeLanguageScreen: FC = () => {
  const navigation = useNavigation();

  const onLanguageChanged = () => {
    navigation.goBack();
  };

  return (
    <Box flex={1}>
      <StatusBar />

      <Box flex={1}>
        <ChangeLanguageSelector onLanguageChanged={onLanguageChanged} px="$2" />
      </Box>
    </Box>
  );
};

export default ChangeLanguageScreen;

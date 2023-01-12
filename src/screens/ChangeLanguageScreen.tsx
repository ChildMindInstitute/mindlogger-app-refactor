import { FC } from 'react';
import { StatusBar } from 'react-native';

import { ChangeLanguageSelector } from '@features/change-language';
import { Box } from '@shared/ui';

const ChangeLanguageScreen: FC = () => {
  return (
    <Box flex={1}>
      <StatusBar />

      <Box flex={1}>
        <ChangeLanguageSelector px="$2" />
      </Box>
    </Box>
  );
};

export default ChangeLanguageScreen;

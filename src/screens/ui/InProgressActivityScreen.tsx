import { FC } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityStepper } from '@features/pass-survey';
import { RootStackParamList } from '@screens/config';
import { colors } from '@shared/lib';
import { BackButton, Box, CrossIcon, StatusBar } from '@shared/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

const InProgressActivityScreen: FC<Props> = ({ navigation }) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="white" pb={bottom}>
      <StatusBar hidden />

      <BackButton alignSelf="flex-end" mr={16} mt={10} mb={4}>
        <CrossIcon color={colors.tertiary} size={30} />
      </BackButton>

      <Box flex={1}>
        <ActivityStepper
          onClose={() => navigation.goBack()}
          onFinish={() => navigation.goBack()}
        />
      </Box>
    </Box>
  );
};

export default InProgressActivityScreen;

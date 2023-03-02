import { FC } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '@screens/config';
import { colors } from '@shared/lib';
import { BackButton, Box, CrossIcon, StatusBar } from '@shared/ui';
import { ActivityStepper } from '@widgets/activity-stepper';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

const InProgressActivityScreen: FC<Props> = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="white" pb={bottom}>
      <StatusBar hidden />

      <BackButton alignSelf="flex-end" mr={16} mt={10} mb={4}>
        <CrossIcon color={colors.tertiary} size={30} />
      </BackButton>

      <Box flex={1}>
        <ActivityStepper />
      </Box>
    </Box>
  );
};

export default InProgressActivityScreen;

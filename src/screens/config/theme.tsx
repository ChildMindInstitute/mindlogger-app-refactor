import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '@shared/lib';
import { CloseIcon, Text } from '@shared/ui';

import { RootStackParamList } from './types';

type ScreenOptions = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const getScreenOptions = ({ navigation }: ScreenOptions) => {
  return {
    headerStyle: {
      backgroundColor: colors.primary,
    },
    headerTitleStyle: {
      color: colors.white,
    },
    headerShadowVisible: false,
    headerLeft: () => (
      <Text onPress={navigation.goBack} mr={24}>
        <CloseIcon color={colors.white} size={22} />
      </Text>
    ),
  };
};

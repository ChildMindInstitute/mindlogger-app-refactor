import {
  BottomTabScreenProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppletTheme } from '@app/entities/applet';
import { colors, IS_ANDROID } from '@shared/lib';
import { DataIcon, SurveyIcon, AboutIcon, Text, CloseIcon } from '@shared/ui';

import { RootStackParamList, AppletDetailsParamList } from './types';

type ScreenOptions = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type BottomScreenOptions = BottomTabScreenProps<AppletDetailsParamList>;

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

export const getAppletDetailsScreenOptions = (appletTheme?: AppletTheme) => {
  return ({ route }: BottomScreenOptions): BottomTabNavigationOptions => {
    const tabBarIcon = (color: string) => {
      switch (route.name) {
        case 'ActivityList':
          return <SurveyIcon color={color} size={40} />;
        case 'Data':
          return <DataIcon color={color} size={40} />;
        case 'About':
          return <AboutIcon color={color} size={40} />;
        default:
          break;
      }
    };

    const tabBarActiveTintColor = appletTheme?.primaryColor || colors.primary;
    const tabBarInactiveTintColor = colors.darkerGrey3;

    return {
      headerShown: false,
      tabBarIcon: ({ color }: { color: string }) => tabBarIcon(color),
      tabBarStyle: {
        backgroundColor: colors.lightBlue,
        paddingBottom: 20,
        paddingTop: 3,
        ...(IS_ANDROID ? { height: 65, paddingBottom: 5 } : {}),
      },
      tabBarLabel: ({ color, focused, children }) => {
        return (
          <Text
            color={color}
            fontWeight={focused ? 'bold' : 'normal'}
            fontSize={11}
          >
            {children}
          </Text>
        );
      },
      tabBarActiveTintColor,
      tabBarInactiveTintColor,
    };
  };
};

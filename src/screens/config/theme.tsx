import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { AppletTheme } from '@app/entities/applet/lib/types';
import { IS_ANDROID, IS_TABLET } from '@app/shared/lib/constants';
import { colors } from '@app/shared/lib/constants/colors';
import { CloseIcon } from '@app/shared/ui/icons';
import { AboutIcon } from '@app/shared/ui/icons/About';
import { DataIcon } from '@app/shared/ui/icons/Data';
import { SurveyIcon } from '@app/shared/ui/icons/Survey';
import { Text } from '@app/shared/ui/Text';

import { AppletDetailsParamList, RootStackNavigationProps } from './types';
import { HeaderTitle } from '../ui/HeaderTitle';

type ScreenOptions = {
  navigation: RootStackNavigationProps;
};

type BottomScreenOptions = BottomTabScreenProps<AppletDetailsParamList>;

export const getScreenOptions = ({
  navigation,
}: ScreenOptions): NativeStackNavigationOptions => {
  return {
    headerStyle: {
      backgroundColor: colors.primary,
    },
    headerShadowVisible: false,
    headerTitle: HeaderTitle,
    headerBackVisible: false,
    headerLeft: () => (
      <Text aria-label="close-button" onPress={navigation.goBack} mr={24}>
        <CloseIcon color={colors.white} size={22} />
      </Text>
    ),
  };
};

export const getAppletDetailsScreenOptions = (
  appletTheme: AppletTheme | null,
  hasBottomInset: boolean,
) => {
  return ({ route }: BottomScreenOptions): BottomTabNavigationOptions => {
    const tabBarIcon = (color: string) => {
      switch (route.name) {
        case 'ActivityList':
          return (
            <SurveyIcon
              accessibilityLabel="activities-tab"
              color={color}
              size={40}
            />
          );
        case 'Data':
          return (
            <DataIcon accessibilityLabel="data-tab" color={color} size={40} />
          );
        case 'About':
          return (
            <AboutIcon accessibilityLabel="about-tab" color={color} size={40} />
          );
        default:
          break;
      }
    };

    const tabBarActiveTintColor = appletTheme?.primaryColor || colors.primary;
    const tabBarInactiveTintColor = colors.darkerGrey3;

    return {
      headerShown: false,
      ...(IS_TABLET
        ? {
            tabBarItemStyle: {
              flexDirection: 'column',
              alignItems: 'center',
              paddingVertical: IS_ANDROID ? 10 : 5,
            },
          }
        : {}),
      tabBarIcon: ({ color }: { color: string }) => tabBarIcon(color),
      tabBarStyle: {
        backgroundColor: colors.lightBlue,
        paddingTop: 3,
        ...(IS_ANDROID ? { paddingBottom: 5 } : {}),
        ...(hasBottomInset
          ? { height: 85, paddingBottom: 20 }
          : { height: 70, paddingBottom: 5 }),
      },
      tabBarLabel: ({ color, focused, children }) => {
        return (
          <Text
            color={color}
            fontWeight={focused ? 'bold' : 'normal'}
            fontSize={11}
            accessibilityLabel={`bottom_nav_button-${children}`}
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

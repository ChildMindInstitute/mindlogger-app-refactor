import { ElementType } from 'react';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '@shared/lib';
import { DataIcon, SurveyIcon, AboutIcon, Text, CloseIcon } from '@shared/ui';

import { RootStackParamList, AppletDetailsParamList } from './types';

type ScreenOptions = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type BottomScreenOptions = {
  route: RouteProp<AppletDetailsParamList>;
};

type TabBarLabelProps = {
  color: string;
  focused: boolean;
  children: ElementType;
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

export const appletDetailsScreenOptions = ({ route }: BottomScreenOptions) => {
  const tabBarIcon = (color: string) => {
    switch (route.name) {
      case 'Activities':
        return <SurveyIcon color={color} size={40} />;
      case 'Data':
        return <DataIcon color={color} size={40} />;
      case 'About':
        return <AboutIcon color={color} size={40} />;
      default:
        break;
    }
  };

  const applet = {
    // mockApplet
    theme: {
      primaryColor: colors.primary,
    },
  };
  const tabBarActiveTintColor = applet?.theme?.primaryColor || colors.primary;
  const tabBarInactiveTintColor = colors.darkerGrey3;

  return {
    headerShown: false,
    tabBarIcon: ({ color }: { color: string }) => tabBarIcon(color),
    tabBarStyle: {
      backgroundColor: colors.lightBlue,
      paddingBottom: 20,
      paddingTop: 3,
    },
    tabBarLabel: ({ color, focused, children }: TabBarLabelProps) => {
      return focused ? (
        <Text color={color} fontWeight="bold" fontSize={11}>
          {children}
        </Text>
      ) : (
        <Text color={color} fontSize={12}>
          {children}
        </Text>
      );
    },
    tabBarActiveTintColor,
    tabBarInactiveTintColor,
  };
};

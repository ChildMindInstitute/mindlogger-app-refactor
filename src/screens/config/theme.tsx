import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { IS_TABLET } from '@app/shared/lib/constants';
import { palette } from '@app/shared/lib/constants/palette';
import { BackButton } from '@app/shared/ui/BackButton';
import { CloseIcon } from '@app/shared/ui/icons';
import { AboutIcon } from '@app/shared/ui/icons/About';
import { DataIcon } from '@app/shared/ui/icons/Data';
import { SurveyIcon } from '@app/shared/ui/icons/Survey';
import { Text } from '@app/shared/ui/Text';
import { DEFAULT_BG } from '@entities/banner/lib/constants.tsx';

import { AppletDetailsParamList } from './types';
import { HeaderTitle } from '../ui/HeaderTitle';

type BottomScreenOptions = BottomTabScreenProps<AppletDetailsParamList>;

export const getScreenOptions = (): NativeStackNavigationOptions => {
  return {
    headerStyle: {
      backgroundColor: DEFAULT_BG,
    },
    headerShadowVisible: false,
    headerTitle: HeaderTitle,
    headerTitleAlign: 'center',
    headerBackVisible: false,
    headerLeft: () => (
      <BackButton aria-label="close-button" p={12}>
        <CloseIcon color={palette.on_surface} size={20} />
      </BackButton>
    ),
  };
};

export const getAppletDetailsScreenOptions = (paddingBottom: number) => {
  return ({ route }: BottomScreenOptions): BottomTabNavigationOptions => {
    const tabBarIcon = (color: string, isSelected: boolean) => {
      switch (route.name) {
        case 'ActivityList':
          return (
            <SurveyIcon
              aria-label="activities-tab"
              color={color}
              size={24}
              isSelected={isSelected}
            />
          );
        case 'Data':
          return (
            <DataIcon
              aria-label="data-tab"
              color={color}
              size={24}
              isSelected={isSelected}
            />
          );
        case 'About':
          return (
            <AboutIcon
              aria-label="about-tab"
              color={color}
              size={24}
              isSelected={isSelected}
            />
          );
        default:
          break;
      }
    };

    return {
      headerShown: false,
      tabBarItemStyle: {
        ...(IS_TABLET
          ? {
              flexDirection: 'column',
              alignItems: 'center',
            }
          : {}),
      },
      tabBarIcon: ({ color, focused }) => tabBarIcon(color, focused),
      tabBarIconStyle: {
        margin: 4,
      },
      tabBarStyle: {
        backgroundColor: palette.surface1,
        borderTopWidth: 0,
        paddingTop: 0,
        paddingHorizontal: 16,
        paddingBottom,
        height: 61 + paddingBottom,
        justifyContent: 'space-between',
        elevation: 0,
      },
      tabBarLabel: ({ color, focused, children }) => {
        return (
          <Text
            color={color}
            fontWeight={focused ? '700' : '400'}
            fontSize={12}
            lineHeight={16}
            letterSpacing={0.5}
            aria-label={`bottom_nav_button-${children}`}
          >
            {children}
          </Text>
        );
      },
      tabBarActiveTintColor: palette.primary,
      tabBarInactiveTintColor: palette.outline,
    };
  };
};

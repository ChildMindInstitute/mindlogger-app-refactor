import { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ActivityIndicator,
  Box,
  Center,
  ImageBackground,
} from '@app/shared/ui';
import { AppletModel, useAppletDetailsQuery } from '@entities/applet';

import {
  AppletDetailsParamList,
  getAppletDetailsScreenOptions,
  RootStackParamList,
} from '../config';
import { ActivityListScreen, AboutAppletScreen, AppletDataScreen } from '../ui';

type Props = NativeStackScreenProps<RootStackParamList, 'AppletDetails'>;

const Tab = createBottomTabNavigator<AppletDetailsParamList>();

const AppletBottomTabNavigator = ({ route, navigation }: Props) => {
  const { t } = useTranslation();

  const { title, appletId } = route.params;

  const { data: applet } = useAppletDetailsQuery(appletId, {
    select: o => AppletModel.mapAppletDetailsFromDto(o.data.result),
  });

  const appletTheme = applet?.theme;

  useLayoutEffect(() => {
    if (title) {
      navigation.setOptions({
        title,
        headerRight: () =>
          applet?.theme?.logo && (
            <Box backgroundColor="$white" style={style.themeLogoContainer}>
              <CachedImage
                source={applet.theme.logo}
                style={style.themeLogo}
                resizeMode="contain"
              />
            </Box>
          ),
      });
    }
  }, [title, navigation, applet?.theme?.logo]);

  useLayoutEffect(() => {
    if (appletTheme) {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: appletTheme.primaryColor,
        },
      });
    }
  }, [appletTheme, navigation]);

  const { bottom } = useSafeAreaInsets();

  return (
    <ImageBackground
      uri={appletTheme?.backgroundImage}
      bg={appletTheme?.primaryColor ?? '$white'}
      loader={
        <Center position="absolute" width="100%" height="100%">
          <ActivityIndicator size="large" color="$secondary" />
        </Center>
      }
    >
      <Tab.Navigator
        screenOptions={getAppletDetailsScreenOptions(
          appletTheme ?? null,
          bottom,
        )}
        initialRouteName="ActivityList"
      >
        <Tab.Screen
          name="ActivityList"
          options={{
            title: t('applet_footer:activities'),
          }}
          component={ActivityListScreen}
          initialParams={route.params}
        />

        <Tab.Screen
          name="Data"
          options={{
            title: t('applet_footer:data'),
          }}
          component={AppletDataScreen}
          initialParams={route.params}
        />

        <Tab.Screen
          name="About"
          options={{
            title: t('applet_footer:about'),
          }}
          component={AboutAppletScreen}
          initialParams={route.params}
        />
      </Tab.Navigator>
    </ImageBackground>
  );
};

const style = StyleSheet.create({
  themeLogoContainer: {
    width: 30,
    height: 30,
    paddingBottom: 0,
  },
  themeLogo: {
    width: '100%',
    height: '100%',
  },
});

export default AppletBottomTabNavigator;

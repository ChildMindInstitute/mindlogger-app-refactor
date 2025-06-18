import { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppletDetailsQuery } from '@app/entities/applet/api/hooks/useAppletDetailsQuery';
import { mapAppletDetailsFromDto } from '@app/entities/applet/model/mappers';
import { bannerActions } from '@app/entities/banner/model/slice';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { useOnFocus } from '@app/shared/lib/hooks/useOnFocus';
import { Box } from '@app/shared/ui/base';
import { ImageBackground } from '@app/shared/ui/ImageBackground';

import { AboutAppletScreen } from './AboutAppletScreen';
import { ActivityListScreen } from './ActivityListScreen';
import { AppletDataScreen } from './AppletDataScreen';
import { getAppletDetailsScreenOptions } from '../config/theme';
import { AppletDetailsParamList, RootStackParamList } from '../config/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AppletDetails'>;

const Tab = createBottomTabNavigator<AppletDetailsParamList>();

export const AppletBottomTabNavigator = ({ route, navigation }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { title, appletId } = route.params;

  const { data: applet } = useAppletDetailsQuery(appletId, {
    select: o => mapAppletDetailsFromDto(o.data.result),
  });

  const appletTheme = applet?.theme;
  const primaryColor = appletTheme?.primaryColor ?? palette.surface1;

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
    navigation.setOptions({
      headerStyle: {
        backgroundColor: primaryColor,
      },
    });
  }, [primaryColor, navigation]);

  useOnFocus(() => {
    dispatch(bannerActions.setBannersBg(primaryColor));
  });

  const { bottom } = useSafeAreaInsets();

  return (
    <ImageBackground uri={appletTheme?.backgroundImage} bg={primaryColor}>
      <Tab.Navigator
        screenOptions={getAppletDetailsScreenOptions(
          appletTheme ?? null,
          Boolean(bottom),
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

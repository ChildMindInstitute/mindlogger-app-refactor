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

  useLayoutEffect(() => {
    if (title) {
      navigation.setOptions({
        title,
        headerRight: () =>
          applet?.theme?.logo && (
            <CachedImage
              source={applet.theme.logo}
              style={style.themeLogo}
              resizeMode="contain"
            />
          ),
      });
    }
  }, [title, navigation, applet?.theme?.logo]);

  useOnFocus(() => {
    dispatch(bannerActions.setBannersBg(palette.surface1));
  });

  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={getAppletDetailsScreenOptions(bottom)}
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
  );
};

const style = StyleSheet.create({
  themeLogo: {
    width: 48,
    height: 48,
    marginBottom: 4,
    resizeMode: 'contain',
  },
});

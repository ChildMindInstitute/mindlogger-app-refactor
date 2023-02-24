import { useLayoutEffect } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { ImageBackground } from '@app/shared/ui';

import {
  AppletDetailsParamList,
  getAppletDetailsScreenOptions,
  RootStackParamList,
} from '../config';
import { ActivityListScreen, AboutAppletScreen } from '../ui';

type Props = NativeStackScreenProps<RootStackParamList, 'AppletDetails'>;

const Tab = createBottomTabNavigator<AppletDetailsParamList>();

const AppletBottomTabNavigator = ({ route, navigation }: Props) => {
  const { t } = useTranslation();

  const { title } = route.params;

  useLayoutEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  }, [title, navigation]);

  return (
    <ImageBackground>
      <Tab.Navigator
        screenOptions={getAppletDetailsScreenOptions}
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
          component={AboutAppletScreen}
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

export default AppletBottomTabNavigator;

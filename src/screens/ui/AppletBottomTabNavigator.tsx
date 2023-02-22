import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import {
  AppletDetailsParamList,
  getAppletDetailsScreenOptions,
  RootStackParamList,
} from '../config';
import { AboutScreen, ActivityListScreen } from '../ui';

type Props = NativeStackScreenProps<RootStackParamList, 'AppletDetails'>;

const Tab = createBottomTabNavigator<AppletDetailsParamList>();

const AppletBottomTabNavigator = ({ route }: Props) => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator screenOptions={getAppletDetailsScreenOptions}>
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
        component={AboutScreen}
        initialParams={route.params}
      />

      <Tab.Screen
        name="About"
        options={{
          title: t('applet_footer:about'),
        }}
        component={AboutScreen}
        initialParams={route.params}
      />
    </Tab.Navigator>
  );
};

export default AppletBottomTabNavigator;

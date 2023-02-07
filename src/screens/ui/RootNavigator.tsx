import { TouchableOpacity } from 'react-native';

import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { APP_VERSION, colors, ENV } from '@shared/lib';
import { Text, UserProfileIcon, HomeIcon } from '@shared/ui';

import { getScreenOptions, RootStackParamList } from '../config';
import { onBeforeAppClose } from '../lib';
import { useDefaultRoute, useInitialRouteNavigation } from '../model';
import {
  AppletsScreen,
  ChangeLanguageScreen,
  ForgotPasswordScreen,
  LoginScreen,
  SignUpScreen,
  AboutScreen,
  ActivityListScreen,
  ChangePasswordScreen,
  SettingsScreen,
} from '../ui';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const defaultRoute = useDefaultRoute();

  useInitialRouteNavigation();

  useBackHandler(() => {
    onBeforeAppClose();

    return true;
  });

  return (
    <Stack.Navigator
      screenOptions={getScreenOptions}
      initialRouteName={defaultRoute}>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

      <Stack.Screen
        name="ForgotPassword"
        options={{
          title: t('login:forgot_password'),
        }}
        component={ForgotPasswordScreen}
      />

      <Stack.Screen
        name="SignUp"
        options={{
          title: t('login:new_user'),
          contentStyle: {
            borderTopColor: colors.grey,
            borderTopWidth: 1,
          },
        }}
        component={SignUpScreen}
      />

      <Stack.Screen
        name="ChangeLanguage"
        options={{
          title: t('language_screen:app_language'),
        }}
        component={ChangeLanguageScreen}
      />

      <Stack.Screen
        name="AboutApp"
        options={{
          title: t('about_app:title_with_version', {
            version: ENV ? `${APP_VERSION} ${ENV}` : APP_VERSION,
          }),
          headerTitleStyle: {
            fontSize: 16,
            color: colors.white,
          },
        }}
        component={AboutScreen}
      />

      <Stack.Screen
        name="Applets"
        options={{
          headerStyle: {
            backgroundColor: colors.lighterGrey2,
          },
          headerTitleStyle: {
            fontSize: 16,
            color: colors.tertiary,
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <UserProfileIcon color={colors.tertiary} size={22} />
            </TouchableOpacity>
          ),
        }}
        component={AppletsScreen}
      />

      <Stack.Screen
        name="ActivityList"
        options={{
          title: 'Applet 123',
          headerStyle: {
            backgroundColor: colors.blue,
          },
          headerTitleStyle: {
            fontSize: 18,
            color: colors.white,
          },
          headerLeft: () => (
            <Text onPress={() => navigation.goBack()} mr={24}>
              <HomeIcon color={colors.white} size={32} />
            </Text>
          ),
        }}
        component={ActivityListScreen}
      />
    </Stack.Navigator>
  );
};

import { TouchableOpacity } from 'react-native';

import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { NotificationModel } from '@app/entities/notification';
import { TapOnNotificationModel } from '@app/features/tap-on-notification';
import { SessionModel } from '@entities/session';
import { EnterForegroundModel } from '@features/enter-foreground';
import { LogoutModel } from '@features/logout';
import {
  APP_VERSION,
  colors,
  ENV,
  useNotificationPermissions,
  IS_ANDROID,
  useBackgroundTask,
} from '@shared/lib';
import { UserProfileIcon, HomeIcon, BackButton, Text, Box } from '@shared/ui';

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
  ChangePasswordScreen,
  SettingsScreen,
  AppletBottomTabNavigator,
  InProgressActivityScreen,
  OpenSourceUsed,
} from '../ui';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const hasSession = SessionModel.useHasSession();
  const defaultRoute = useDefaultRoute();
  const { forceLogout } = LogoutModel.useLogout();

  useInitialRouteNavigation();
  useNotificationPermissions();

  EnterForegroundModel.useRestackNotifications();

  useBackHandler(() => {
    onBeforeAppClose();

    return true;
  });

  SessionModel.useOnRefreshTokenFail(() => {
    forceLogout();
  });

  TapOnNotificationModel.useOnNotificationTap();

  useBackgroundTask(() => {
    NotificationModel.topUpNotifications();
  });

  return (
    <Stack.Navigator
      screenOptions={getScreenOptions}
      initialRouteName={defaultRoute}
    >
      {!hasSession && (
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="OpenSourceUsed"
            options={{
              title: t('open_source:title'),
            }}
            component={OpenSourceUsed}
          />

          <Stack.Screen
            name="ForgotPassword"
            options={{
              title: t('login:forgot_password'),
              contentStyle: {
                borderTopColor: colors.grey,
                borderTopWidth: 1,
              },
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
        </>
      )}

      {hasSession && (
        <>
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
                <TouchableOpacity
                  onPress={() => navigation.navigate('Settings')}
                >
                  <UserProfileIcon color={colors.tertiary} size={22} />
                </TouchableOpacity>
              ),
              headerLeft: () => null,
            }}
            component={AppletsScreen}
          />

          <Stack.Screen
            name="Settings"
            options={{
              title: t('settings:user_settings'),
            }}
            component={SettingsScreen}
          />

          <Stack.Screen
            name="ChangePassword"
            options={{
              title: t('settings:change_pass'),
            }}
            component={ChangePasswordScreen}
          />

          <Stack.Screen
            name="AppletDetails"
            component={AppletBottomTabNavigator}
            options={({ route }) => ({
              headerBackVisible: false,
              headerTitle: IS_ANDROID
                ? () => (
                    <Box flex={1} mr={20}>
                      <Text
                        color={colors.white}
                        fontSize={18}
                        fontWeight="700"
                        numberOfLines={1}
                      >
                        {route.params.title}
                      </Text>
                    </Box>
                  )
                : undefined,
              headerLeft: () => (
                <BackButton mr={IS_ANDROID && 15} fallbackRoute="Applets">
                  <HomeIcon color={colors.white} size={32} />
                </BackButton>
              ),
            })}
          />

          <Stack.Screen
            name="InProgressActivity"
            component={InProgressActivityScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}

      <Stack.Group navigationKey={hasSession ? 'user' : 'guest'}>
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
      </Stack.Group>
    </Stack.Navigator>
  );
};

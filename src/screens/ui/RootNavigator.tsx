import { useCallback } from 'react';
import { TouchableOpacity, Text as RNText } from 'react-native';

import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  AutocompletionEventOptions,
  AutocompletionExecuteOptions,
  EntityPath,
  LogAutocompletionTrigger,
} from '@app/abstract/lib';
import { ActivityModel } from '@app/entities/activity';
import { MediaFilesCleaner } from '@app/entities/activity';
import { AppletModel } from '@app/entities/applet';
import { NotificationModel } from '@app/entities/notification';
import { LoginModel } from '@app/features/login';
import { TapOnNotificationModel } from '@app/features/tap-on-notification';
import { SystemRecord } from '@app/shared/lib/records';
import { ActivityGroupsModel } from '@app/widgets/activity-group';
import { SurveyModel } from '@app/widgets/survey';
import { SessionModel } from '@entities/session';
import { EnterForegroundModel } from '@features/enter-foreground';
import { LogoutModel } from '@features/logout';
import {
  APP_VERSION,
  colors,
  ENV,
  useNotificationPermissions,
  IS_ANDROID,
  useAlarmPermissions,
  useBackgroundTask,
  useAppSelector,
  useFirebaseSetup,
  useOnlineEstablished,
  useOnceRef,
  Emitter,
  useOnForegroundDebounced,
  useDelayedInterval,
} from '@shared/lib';
import {
  UserProfileIcon,
  HomeIcon,
  BackButton,
  Text,
  Box,
  ChevronLeft,
  XStack,
  CloseIcon,
} from '@shared/ui';

import {
  appletScreenHeaderStyles,
  getScreenOptions,
  RootStackParamList,
} from '../config';
import { onBeforeAppClose } from '../lib';
import { useDefaultRoute, useInitialRouteNavigation } from '../model';
import { checkEntityAvailability } from '../model/checkEntityAvailability';
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
  ApplicationLogsScreen,
  PasswordRecoveryScreen,
  AutocompletionScreen,
} from '../ui';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AUTOCOMPLETION_DELAY = 2000; // time-window to handle notification

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const hasSession = SessionModel.useHasSession();
  const defaultRoute = useDefaultRoute();
  const { forceLogout } = LogoutModel.useLogout();

  const queryClient = useQueryClient();

  const entityProgressions = useAppSelector(
    AppletModel.selectors.selectAppletsEntityProgressions,
  );

  useInitialRouteNavigation();
  useNotificationPermissions();
  useAlarmPermissions();
  useFirebaseSetup({
    onFCMTokenCreated: fcmToken => {
      SystemRecord.setDeviceId(fcmToken);
    },
  });

  EnterForegroundModel.useAnalyticsEventTrack();

  useBackHandler(() => {
    onBeforeAppClose();

    return true;
  });

  SessionModel.useOnRefreshTokenFail(() => {
    forceLogout();
  });

  useBackgroundTask(() => {
    return NotificationModel.topUpNotifications();
  });

  const { completeEntityIntoUploadToQueue, hasExpiredEntity } =
    SurveyModel.useAutoCompletion();

  TapOnNotificationModel.useOnNotificationTap({
    checkAvailability: async (
      entityName: string,
      { appletId, eventId, entityId, entityType, targetSubjectId }: EntityPath,
    ) => {
      const isSuccess = await checkEntityAvailability({
        entityName,
        identifiers: {
          appletId,
          eventId,
          entityId,
          entityType,
          targetSubjectId,
        },
        queryClient,
        entityProgressions,
      });

      if (!isSuccess) {
        Emitter.emit<AutocompletionEventOptions>('autocomplete', {
          checksToExclude: ['start-entity'],
          logTrigger: 'check-availability',
        });
      }
      return isSuccess;
    },
    hasMediaReferences: ActivityModel.MediaLookupService.hasMediaReferences,
    cleanUpMediaFiles: MediaFilesCleaner.cleanUp,
    hasActivityWithHiddenAllItems:
      ActivityModel.ItemsVisibilityValidator.hasActivityWithHiddenAllItems,
    evaluateAvailableTo:
      ActivityGroupsModel.useAvailabilityEvaluator().evaluateAvailableTo,
    completeEntityIntoUploadToQueue,
  });

  EnterForegroundModel.useRestackNotifications(hasExpiredEntity);

  const { executeAutocompletion } = SurveyModel.useAutoCompletionExecute();

  const executeAutocompletionWithDelay = useCallback(
    (
      logTrigger: LogAutocompletionTrigger,
      options: AutocompletionExecuteOptions,
    ) =>
      setTimeout(
        () => executeAutocompletion(logTrigger, options),
        AUTOCOMPLETION_DELAY,
      ),
    [executeAutocompletion],
  );

  useDelayedInterval(() =>
    executeAutocompletion('app-level-timer', {
      forceUpload: false,
      checksToInclude: ['is-offline'],
    }),
  );

  useOnlineEstablished(() =>
    executeAutocompletion('to-online', { forceUpload: true }),
  );

  useOnceRef(() =>
    executeAutocompletionWithDelay('app-start', { forceUpload: true }),
  );

  useOnForegroundDebounced(() =>
    executeAutocompletionWithDelay('to-foreground', { forceUpload: false }),
  );

  SurveyModel.useOnAutoCompletion();

  LoginModel.useAnalyticsAutoLogin();

  LoginModel.useFeatureFlagsAutoLogin();

  NotificationModel.useOnNotificationRefresh();

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
            name="ForgotPassword"
            options={{
              title: t('login:forgot_password'),
              contentStyle: {
                borderTopColor: colors.grey,
                borderTopWidth: 1,
              },
              headerLeft: () => (
                <Text
                  accessibilityLabel="close-button"
                  onPress={navigation.goBack}
                  mr={24}
                >
                  <CloseIcon color={colors.white} size={22} />
                </Text>
              ),
            }}
            component={ForgotPasswordScreen}
          />

          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              headerBackTitle: 'Back',
              title: '',
              headerLeft: () => (
                <BackButton accessibilityLabel="back_button">
                  <XStack ai="center">
                    <ChevronLeft color="white" size={16} />

                    <Text ml={2} color="$white" fontSize={16}>
                      Back
                    </Text>
                  </XStack>
                </BackButton>
              ),
            }}
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

              headerTitle: props => (
                <RNText
                  accessibilityLabel="welcome_name-text"
                  style={appletScreenHeaderStyles.title}
                >
                  {props.children}
                </RNText>
              ),
              headerRight: () => (
                <TouchableOpacity
                  accessibilityLabel="user_settings-button"
                  onPress={() => {
                    if (AppletModel.RefreshService.isBusy()) {
                      return;
                    }
                    navigation.navigate('Settings');
                  }}
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
            name="ApplicationLogs"
            options={{
              title: t('settings:upload_logs'),
            }}
            component={ApplicationLogsScreen}
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
                <BackButton
                  accessibilityLabel="home-button"
                  mr={IS_ANDROID && 15}
                  fallbackRoute="Applets"
                >
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

          <Stack.Screen
            name="Autocompletion"
            component={AutocompletionScreen}
            options={{
              headerShown: false,
              gestureEnabled: false,
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

      <Stack.Screen
        name="PasswordRecovery"
        component={PasswordRecoveryScreen}
        options={{
          title: t('settings:create_new_password'),
        }}
      />
    </Stack.Navigator>
  );
};

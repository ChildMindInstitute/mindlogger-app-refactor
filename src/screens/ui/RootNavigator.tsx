import { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  AutocompletionEventOptions,
  AutocompletionExecuteOptions,
  LogAutocompletionTrigger,
} from '@app/abstract/lib/types/autocompletion';
import { EntityPath } from '@app/abstract/lib/types/entity';
import { getDefaultMediaFilesCleaner } from '@app/entities/activity/lib/services/mediaFilesCleanerInstance';
import { getDefaultItemsVisibilityValidator } from '@app/entities/activity/model/services/itemsVisibilityValidatorInstsance';
import { getDefaultMediaLookupService } from '@app/entities/activity/model/services/mediaLookupServiceInstance';
import { selectAppletsEntityProgressions } from '@app/entities/applet/model/selectors';
import { useDefaultBanners } from '@app/entities/defaultBanners/lib/hooks/useDefaultBanners';
import { useOnNotificationRefresh } from '@app/entities/notification/model/hooks/useOnNotificationRefresh';
import { topUpNotifications } from '@app/entities/notification/model/operations/topUpNotifications';
import { useHasSession } from '@app/entities/session/model/hooks/useHasSession';
import { useOnRefreshTokenFail } from '@app/entities/session/model/hooks/useOnRefreshTokenFail';
import { useAnalyticsEventTrack } from '@app/features/enter-foreground/model/hooks/useAnalyticsEventTrack';
import { useRestackNotifications } from '@app/features/enter-foreground/model/hooks/useRestackNotifications';
import { useAnalyticsAutoLogin } from '@app/features/login/model/useAnalyticsAutoLogin';
import { useFeatureFlagsAutoLogin } from '@app/features/login/model/useFeatureFlagsAutoLogin';
import { useLogout } from '@app/features/logout/model/hooks';
import { useOnNotificationTap } from '@app/features/tap-on-notification/model/hooks/useOnNotificationTap';
import { APP_VERSION, ENV, IS_ANDROID } from '@app/shared/lib/constants';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { useAlarmPermissions } from '@app/shared/lib/hooks/useAlarmPermissions';
import { useBackgroundTask } from '@app/shared/lib/hooks/useBackgroundTask';
import { useFirebaseSetup } from '@app/shared/lib/hooks/useFirebaseSetup';
import { useNotificationPermissions } from '@app/shared/lib/hooks/useNotificationPermissions';
import { useOnceRef } from '@app/shared/lib/hooks/useOnceRef';
import { useOnForegroundDebounced } from '@app/shared/lib/hooks/useOnForegroundDebounced';
import { useOnlineEstablished } from '@app/shared/lib/hooks/useOnlineEstablished';
import { getDefaultSystemRecord } from '@app/shared/lib/records/systemRecordInstance';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { useDelayedInterval } from '@app/shared/lib/timers/hooks/useDelayedInterval';
import { getMutexDefaultInstanceManager } from '@app/shared/lib/utils/mutexDefaultInstanceManagerInstance';
import { BackButton } from '@app/shared/ui/BackButton';
import { Box, XStack } from '@app/shared/ui/base';
import {
  ChevronLeftIcon,
  CloseIcon,
  HomeIcon,
  UserProfileIcon,
} from '@app/shared/ui/icons';
import { Text } from '@app/shared/ui/Text';
import { useAvailabilityEvaluator } from '@app/widgets/activity-group/model/hooks/useAvailabilityEvaluator';
import { useAutoCompletion } from '@app/widgets/survey/model/hooks/useAutoCompletion';
import { useAutoCompletionExecute } from '@app/widgets/survey/model/hooks/useAutoCompletionExecute';
import { useOnAutoCompletion } from '@app/widgets/survey/model/hooks/useOnAutoCompletion';

import { AboutScreen } from './AboutScreen';
import { AppletBottomTabNavigator } from './AppletBottomTabNavigator';
import { AppletsScreen } from './AppletsScreen';
import { ApplicationLogsScreen } from './ApplicationLogsScreen';
import { AutocompletionScreen } from './AutocompletionScreen';
import { ChangeLanguageScreen } from './ChangeLanguageScreen';
import { ChangePasswordScreen } from './ChangePasswordScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { HeaderTitle } from './HeaderTitle';
import { InProgressActivityScreen } from './InProgressActivityScreen';
import { LoginScreen } from './LoginScreen';
import { PasswordRecoveryScreen } from './PasswordRecoveryScreen';
import { SettingsScreen } from './SettingsScreen';
import { SignUpScreen } from './SignUpScreen';
import { getScreenOptions } from '../config/theme';
import { RootStackParamList } from '../config/types';
import { onBeforeAppClose } from '../lib/alerts';
import { checkEntityAvailability } from '../model/checkEntityAvailability';
import { useDefaultRoute } from '../model/hooks/useDefaultRoute';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AUTOCOMPLETION_DELAY = 2000; // time-window to handle notification

export const RootNavigator = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const hasSession = useHasSession();
  const defaultRoute = useDefaultRoute();
  const { forceLogout } = useLogout();

  const queryClient = useQueryClient();

  const entityProgressions = useAppSelector(selectAppletsEntityProgressions);

  useNotificationPermissions();
  useAlarmPermissions();
  useFirebaseSetup({
    onFCMTokenCreated: fcmToken => {
      getDefaultSystemRecord().setDeviceId(fcmToken);
    },
  });

  useAnalyticsEventTrack();

  useBackHandler(() => {
    onBeforeAppClose();

    return true;
  });

  useOnRefreshTokenFail(() => {
    forceLogout();
  });

  useBackgroundTask(() => {
    return topUpNotifications();
  });

  const { completeEntityIntoUploadToQueue, hasExpiredEntity } =
    useAutoCompletion();

  useOnNotificationTap({
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
    hasMediaReferences: getDefaultMediaLookupService().hasMediaReferences,
    cleanUpMediaFiles: getDefaultMediaFilesCleaner().cleanUp,
    hasActivityWithHiddenAllItems:
      getDefaultItemsVisibilityValidator().hasActivityWithHiddenAllItems,
    evaluateAvailableTo: useAvailabilityEvaluator().evaluateAvailableTo,
    completeEntityIntoUploadToQueue,
  });

  useRestackNotifications(hasExpiredEntity);

  const { executeAutocompletion } = useAutoCompletionExecute();

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

  useOnAutoCompletion();

  useAnalyticsAutoLogin();

  useFeatureFlagsAutoLogin();

  useOnNotificationRefresh();

  useDefaultBanners();

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
              headerLeft: () => (
                <Text
                  aria-label="close-button"
                  onPress={navigation.goBack}
                  mr={24}
                >
                  <CloseIcon color="$on_surface" size={22} />
                </Text>
              ),
              // For proper centering on Android
              headerRight: () => <Box ml={44} />,
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
                <BackButton aria-label="back_button">
                  <XStack ai="center">
                    <ChevronLeftIcon color={palette.on_surface} size={12} />

                    <Text ml="$2">{t('applet_invite_flow:back')}</Text>
                  </XStack>
                </BackButton>
              ),
              // For proper centering on Android
              headerRight: () => <Box ml={44} />,
            }}
          />
        </>
      )}

      {hasSession && (
        <>
          <Stack.Screen
            name="Applets"
            options={{
              headerTitleAlign: 'center',

              headerTitle: ({ children }) => (
                <HeaderTitle
                  aria-label="welcome_name-text"
                  color={palette.tertiary}
                >
                  {children}
                </HeaderTitle>
              ),
              headerRight: () => (
                <TouchableOpacity
                  accessibilityLabel="user_settings-button"
                  onPress={() => {
                    if (
                      getMutexDefaultInstanceManager()
                        .getRefreshServiceMutex()
                        .isBusy()
                    ) {
                      return;
                    }
                    navigation.navigate('Settings');
                  }}
                >
                  <UserProfileIcon color={palette.tertiary} size={22} />
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
                    <Box
                      flex={1}
                      mr={20}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text
                        color={palette.white}
                        fontSize={18}
                        fontWeight="700"
                        numberOfLines={1}
                      >
                        {route.params.title}
                      </Text>
                    </Box>
                  )
                : HeaderTitle,
              headerLeft: () => (
                <BackButton
                  aria-label="home-button"
                  {...(IS_ANDROID && { mr: 15 })}
                  fallbackRoute="Applets"
                >
                  <HomeIcon color={palette.white} size={32} />
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
          }}
          component={AboutScreen}
        />
      </Stack.Group>

      <Stack.Screen
        name="PasswordRecovery"
        component={PasswordRecoveryScreen}
        options={{
          title: t('settings:create_new_password'),
          headerLeft: () => (
            <Text aria-label="close-button" onPress={navigation.goBack} mr={24}>
              <CloseIcon color="$on_surface" size={22} />
            </Text>
          ),
          // For proper centering on Android
          headerRight: () => <Box ml={44} />,
        }}
      />
    </Stack.Navigator>
  );
};

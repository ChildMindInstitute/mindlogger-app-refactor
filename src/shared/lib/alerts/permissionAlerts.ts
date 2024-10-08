import { Alert, Linking, Platform } from 'react-native';

import notifee from '@notifee/react-native';
import i18n from 'i18next';
import { openSettings } from 'react-native-permissions';

import { IS_ANDROID } from '../constants';
import { openAlarmPermissionSettings } from '../permissions/notificationPermissions';
import { getDefaultLogger } from '../services/loggerInstance';

export const handleBlockedPermissions = async (
  title: string,
  subtitle: string,
) =>
  new Promise(resolve => {
    const { t } = i18n;

    Alert.alert(title, subtitle, [
      {
        text: t('permissions:alert_button_cancel'),
        onPress: () => {
          getDefaultLogger().log(
            `[permissionAlerts.handleBlockedPermissions] ${title} result: dismissed`,
          );
          resolve(false);
        },
        style: 'cancel',
      },
      {
        text: t('permissions:alert_button_ok'),
        onPress: async () => {
          getDefaultLogger().log(
            `[permissionAlerts.handleBlockedPermissions] ${title} result: opened settings`,
          );
          await openSettings();
          resolve(false);
        },
        style: 'default',
      },
    ]);
  });

export const onAlarmPermissionsDisabled = () => {
  const { t } = i18n;

  Alert.alert(
    t('permissions:alarm_permission_warning'),
    t('permissions:alarm_permission_disabled'),
    [
      {
        text: t('permissions:alert_button_cancel'),
        style: 'cancel',
        onPress: () => {
          getDefaultLogger().log(
            '[permissionAlerts.onAlarmPermissionsDisabled] result: dismissed',
          );
        },
      },
      {
        text: t('permissions:alert_button_ok'),
        onPress: () => {
          getDefaultLogger().log(
            '[permissionAlerts.onAlarmPermissionsDisabled] result: opened settings',
          );
          openAlarmPermissionSettings();
        },
        style: 'default',
      },
    ],
  );
};

export const onNotificationPermissionsDisabled = () => {
  Alert.alert(
    i18n.t('firebase_messaging:alert_title'),
    i18n.t('firebase_messaging:alert_message'),
    [
      {
        text: 'Dismiss',
        style: 'cancel',
        onPress: () => {
          getDefaultLogger().log(
            `[permissionAlerts.onNotificationPermissionsDisabled] OS[${Platform.OS}] result: dismissed`,
          );
        },
      },
      {
        text: i18n.t('firebase_messaging:alert_text'),
        onPress: () => {
          getDefaultLogger().log(
            `[permissionAlerts.onNotificationPermissionsDisabled] OS[${Platform.OS}] result: opened settings`,
          );

          IS_ANDROID
            ? notifee.openNotificationSettings()
            : Linking.openSettings();
        },
        style: 'default',
      },
    ],
  );
};

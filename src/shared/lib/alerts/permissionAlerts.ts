import { Alert, Linking } from 'react-native';

import notifee from '@notifee/react-native';
import i18n from 'i18next';
import { openSettings } from 'react-native-permissions';

import { IS_ANDROID } from '../constants';
import { openAlarmPermissionSettings } from '../permissions';

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
          resolve(false);
        },
        style: 'cancel',
      },
      {
        text: t('permissions:alert_button_ok'),
        onPress: async () => {
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
      },
      {
        text: t('permissions:alert_button_ok'),
        onPress: () => {
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
      },
      {
        text: i18n.t('firebase_messaging:alert_text'),
        onPress: () =>
          IS_ANDROID
            ? notifee.openNotificationSettings()
            : Linking.openSettings(),
        style: 'default',
      },
    ],
  );
};

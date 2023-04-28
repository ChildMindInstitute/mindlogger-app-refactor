import { Alert } from 'react-native';

import i18n from 'i18next';
import { openSettings } from 'react-native-permissions';

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

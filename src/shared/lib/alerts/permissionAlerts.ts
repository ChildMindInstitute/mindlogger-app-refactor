import { Alert } from 'react-native';

import i18n from 'i18next';
import { openSettings } from 'react-native-permissions';

export const handleBlockedPermissions = async (
  title: string,
  subtitle: string,
) =>
  new Promise(resolve => {
    const { t } = i18n;

    Alert.alert(title, subtitle, [
      {
        text: t('audio_recorder:alert_button_cancel'),
        onPress: () => {
          resolve(false);
        },
        style: 'cancel',
      },
      {
        text: t('audio_recorder:alert_button_ok'),
        onPress: async () => {
          await openSettings();
          resolve(false);
        },
        style: 'default',
      },
    ]);
  });

import { Alert, BackHandler } from 'react-native';

import i18n from 'i18next';

export function onBeforeAppClose() {
  Alert.alert(
    i18n.t('navigator:exit_title'),
    i18n.t('navigator:exit_subtitle'),
    [
      {
        text: i18n.t('navigator:cancel'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => BackHandler.exitApp(),
      },
    ],
    {
      cancelable: false,
    },
  );
}

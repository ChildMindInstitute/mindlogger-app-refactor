import { Alert } from 'react-native';

import i18n from 'i18next';

export function onAppletNotFound() {
  Alert.alert(
    i18n.t('firebase_messaging:applet_not_found_1'),
    i18n.t('firebase_messaging:applet_not_found_2'),
  );
}

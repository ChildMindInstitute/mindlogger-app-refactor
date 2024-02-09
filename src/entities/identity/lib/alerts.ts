import { Alert } from 'react-native';

import i18n from 'i18next';

type OnBeforeLogoutArgs = {
  isOnline: boolean;
  onCancel: (() => void) | null;
  onLogout: () => void;
};

export function onBeforeLogout({ isOnline, onCancel, onLogout }: OnBeforeLogoutArgs) {
  Alert.alert(
    i18n.t('logout_warning:warning'),
    `${
      isOnline ? i18n.t('logout_warning:currently_uploading') : i18n.t('logout_warning:not_uploaded')
    }\n\n${i18n.t('logout_warning:sure_logout')}`,
    [
      {
        text: i18n.t('logout_warning:cancel'),
        onPress: () => onCancel && onCancel(),
      },
      {
        text: i18n.t('logout_warning:logout'),
        onPress: onLogout,
      },
    ],
    { cancelable: false },
  );
}

import { Alert } from 'react-native';

import i18n from 'i18next';

type Input = {
  onRetry: () => void;
  onLater: () => void;
};

export function showUploadErrorAlert({ onRetry, onLater }: Input) {
  Alert.alert(
    '',
    i18n.t('additional:want_to_retry'),
    [
      {
        text: i18n.t('additional:retry'),
        onPress: onRetry,
      },
      {
        text: i18n.t('additional:later'),
        onPress: onLater,
      },
    ],
    { cancelable: false },
  );
}

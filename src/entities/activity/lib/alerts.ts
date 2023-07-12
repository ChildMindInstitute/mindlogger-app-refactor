import { Alert } from 'react-native';

import i18n from 'i18next';

type onUploadErrorArgs = {
  onRetry: () => void;
  onLater: () => void;
};

export function showUploadErrorAlert({ onRetry, onLater }: onUploadErrorArgs) {
  Alert.alert(
    i18n.t('Queue upload error'),
    i18n.t('Would you like to retry?'),
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

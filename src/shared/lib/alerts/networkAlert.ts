import { Alert } from 'react-native';

import i18n from 'i18next';

export const onNetworkUnavailable = () => {
  return new Promise(resolve => {
    Alert.alert(
      i18n.t('network_alerts:no_internet_title'),
      i18n.t('network_alerts:no_internet_subtitle'),
      [
        {
          text: i18n.t('network_alerts:no_internet_text'),
          onPress: resolve,
        },
      ],
    );
  });
};

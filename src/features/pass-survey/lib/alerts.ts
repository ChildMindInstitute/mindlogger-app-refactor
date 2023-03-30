import { Alert } from 'react-native';

import i18n from 'i18next';

export function onIncorrectAnswerGiven() {
  Alert.alert(i18n.t('activity:failed'), i18n.t('activity:incorrect_answer'), [
    {
      text: 'OK',
    },
  ]);
}

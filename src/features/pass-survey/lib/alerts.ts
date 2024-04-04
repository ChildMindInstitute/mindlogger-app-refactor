import { Alert } from 'react-native';

import i18n from 'i18next';

export function onIncorrectAnswerGiven() {
  Alert.alert(i18n.t('activity:failed'), i18n.t('activity:incorrect_answer'), [
    {
      text: 'OK',
    },
  ]);
}

export function fetchSkipActivityUserConfirmation() {
  return new Promise(resolve => {
    Alert.alert(
      i18n.t('activity_skip_popup:popup_title'),
      i18n.t('activity_skip_popup:popup_description'),
      [
        {
          text: i18n.t('activity_skip_popup:keep_working'),
          onPress: () => {
            resolve(false);
          },
          style: 'cancel',
        },

        {
          text: i18n.t('activity_skip_popup:skip'),
          onPress: () => {
            resolve(true);
          },
          style: 'default',
        },
      ],
    );
  });
}

import { Alert } from 'react-native';

import i18n from 'i18next';

export function onDeleteAccount(onConfirm: () => void) {
  Alert.alert(
    i18n.t('delete_user_account:request'),
    i18n.t('delete_user_account:delete_data'),
    [
      {
        text: i18n.t('delete_user_account:cancel'),
      },
      {
        text: i18n.t('delete_user_account:confirm'),
        onPress: onConfirm,
      },
    ],
  );
}

export function onDeleteAccountConfirmed() {
  Alert.alert(
    i18n.t('delete_user_account:request_sent'),
    i18n.t('delete_user_account:what_to_know'),
    [
      {
        text: 'Ok',
      },
    ],
  );
}

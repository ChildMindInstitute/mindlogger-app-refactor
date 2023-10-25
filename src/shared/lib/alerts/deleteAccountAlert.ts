import { Alert } from 'react-native';

export function onDeleteAccount(onConfirm: () => void) {
  Alert.alert(
    'Account Deletion Request',
    'Are you sure you want to delete your account? All data will be permanently deleted',
    [
      {
        text: 'Cancel',
      },
      {
        text: 'Yes, delete',
        onPress: onConfirm,
      },
    ],
  );
}

export function onDeleteAccountConfirmed() {
  Alert.alert(
    'Account Deletion Request Has Been Sent',
    `Account Deletion takes up to 24 hours.\n\n
      During this time, you will be logged out, and access to your account will be blocked.\n\n
      If you change your mind please contact us
      `,
    [
      {
        text: 'Ok',
      },
    ],
  );
}

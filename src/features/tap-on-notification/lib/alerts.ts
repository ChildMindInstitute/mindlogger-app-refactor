import { Alert } from 'react-native';

import { format } from 'date-fns';
import i18n from 'i18next';
import ToastMessage from 'react-native-toast-message';

export function onAppletNotFound() {
  Alert.alert(
    i18n.t('firebase_messaging:applet_not_found_1'),
    i18n.t('firebase_messaging:applet_not_found_2'),
  );
}

export function onActivityNotAvailable(entityName: string, onOk: () => void) {
  Alert.alert(
    i18n.t('firebase_messaging:activity_not_found', { entityName }),
    undefined,
    [
      {
        onPress: onOk,
        text: i18n.t('system:ok'),
      },
    ],
  );
}

export function onAppWasKilledOnReduxPersist(onOk: () => void) {
  Alert.alert(
    `${i18n.t('firebase_messaging:app_killed_on_redux_persist')}`,
    undefined,
    [
      {
        onPress: onOk,
        text: i18n.t('system:ok'),
      },
    ],
  );
}

export function onCompletedToday(name: string, onOk: () => void) {
  Alert.alert(
    `${i18n.t('firebase_messaging:already_completed')} '${name}'`,
    undefined,
    [
      {
        onPress: onOk,
        text: i18n.t('system:ok'),
      },
    ],
  );
}

export function onScheduledToday(
  name: string,
  timeFrom: Date,
  onOk: () => void,
) {
  const from = format(timeFrom, 'HH:mm');

  Alert.alert(
    '',
    `${i18n.t('firebase_messaging:not_able_to_start')}, '${name}' ${i18n.t(
      'firebase_messaging:is',
    )} ` +
      `${i18n.t('firebase_messaging:scheduled_to_start_at')} ${from} ${i18n.t(
        'firebase_messaging:today',
      )}`,
    [
      {
        onPress: onOk,
        text: i18n.t('system:ok'),
      },
    ],
  );
}

export function showNotAssignedToast(entityName: string) {
  ToastMessage.show({
    type: 'info',
    text1: i18n.t('firebase_messaging:activity_not_available_message', {
      defaultValue:
        'The activity you tried to access is currently unavailable. You may try again later during the next scheduled time window.',
    }),
    position: 'top',
    visibilityTime: 10000,
    autoHide: true,
    topOffset: 60,
  });
}

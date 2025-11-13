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

export function onActivityNotAvailable(entityName: string) {
  ToastMessage.show({
    type: 'info',
    text1: i18n.t('firebase_messaging:activity_not_available', { entityName }),
    position: 'top',
    visibilityTime: 10000,
    autoHide: true,
    topOffset: 60,
  });
}

export function onAppWasKilledOnReduxPersist() {
  Alert.alert(
    `${i18n.t('firebase_messaging:app_killed_on_redux_persist')}`,
    undefined,
    [
      {
        text: i18n.t('system:ok'),
      },
    ],
  );
}

export function onCompletedToday(name: string) {
  ToastMessage.show({
    type: 'info',
    text1: i18n.t('firebase_messaging:activity_completed_today', {
      entityName: name,
    }),
    position: 'top',
    visibilityTime: 10000,
    autoHide: true,
    topOffset: 60,
  });
}

export function onScheduledToday(name: string, timeFrom: Date) {
  const from = format(timeFrom, 'HH:mm');

  ToastMessage.show({
    type: 'info',
    text1: i18n.t('firebase_messaging:activity_scheduled_today', {
      entityName: name,
      time: from,
    }),
    position: 'top',
    visibilityTime: 10000,
    autoHide: true,
    topOffset: 60,
  });
}

export function showNotAssignedToast(entityName: string) {
  ToastMessage.show({
    type: 'info',
    text1: i18n.t('firebase_messaging:activity_not_assigned', {
      entityName,
    }),
    position: 'top',
    visibilityTime: 10000,
    autoHide: true,
    topOffset: 60,
  });
}

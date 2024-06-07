import { Alert } from 'react-native';

import { format } from 'date-fns';
import i18n from 'i18next';

export function onAppletNotFound() {
  Alert.alert(
    i18n.t('firebase_messaging:applet_not_found_1'),
    i18n.t('firebase_messaging:applet_not_found_2'),
  );
}

export function onActivityNotAvailable(onOk: () => void) {
  Alert.alert(i18n.t('firebase_messaging:activity_not_found'), undefined, [
    {
      onPress: onOk,
      text: i18n.t('system:ok'),
    },
  ]);
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
    `${i18n.t('firebase_messaging:not_able_to_start')}, ‘${name}’ ${i18n.t(
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

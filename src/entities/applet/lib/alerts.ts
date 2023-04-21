import { Alert } from 'react-native';

import i18n from 'i18next';

type OnBeforeStartingActivityArgs = {
  onRestart: () => void;
  onResume: () => void;
};

export function onBeforeStartingActivity({
  onRestart,
  onResume,
}: OnBeforeStartingActivityArgs) {
  Alert.alert(
    i18n.t('additional:resume_activity'),
    i18n.t('additional:activity_resume_restart'),
    [
      {
        text: i18n.t('additional:restart'),
        onPress: onRestart,
      },
      {
        text: i18n.t('additional:resume'),
        onPress: onResume,
      },
    ],
    { cancelable: false },
  );
}

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

export function onMediaReferencesFound() {
  Alert.alert(
    i18n.t('media:media_found_title'),
    i18n.t('media:media_found_body'),
  );
}

export function onMigrationsNotApplied() {
  Alert.alert('', i18n.t('system:migration_not_applied_text'));
}

export function onAppletRefreshError() {
  Alert.alert(
    i18n.t('applet_list_component:refresh_error_header'),
    i18n.t('applet_list_component:common_refresh_error'),
  );
}

export function onAppletListRefreshError(applets: string[]) {
  Alert.alert(
    i18n.t('applet_list_component:refresh_error_header'),
    i18n.t('applet_list_component:applets_not_refreshed') +
      '\n' +
      applets.reduce((result, current) => {
        return (result.length ? result + '\n' : '') + current;
      }, ''),
  );
}

export function onActivityContainsAllItemsHidden(entityName: string) {
  Alert.alert('', i18n.t('activity:activity_all_items_hidden', { entityName }));
}

export function onFlowActivityContainsAllItemsHidden(entityName: string) {
  Alert.alert('', i18n.t('activity:flow_all_items_hidden', { entityName }));
}

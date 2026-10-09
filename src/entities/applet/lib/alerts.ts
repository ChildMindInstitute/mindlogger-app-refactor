import { Alert } from 'react-native';

import i18n from 'i18next';

import { promptResumeRestart } from '../ui/ResumeRestartPrompt';

type OnBeforeStartingActivityArgs = {
  onRestart: () => void;
  onResume: () => void;
  onDismiss: () => void;
};

export function onBeforeStartingActivity({
  onRestart,
  onResume,
  onDismiss,
}: OnBeforeStartingActivityArgs) {
  const handlers = {
    resume: onResume,
    restart: onRestart,
    dismiss: onDismiss,
  };

  promptResumeRestart()
    .then(choice => handlers[choice]())
    .catch(onDismiss);
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
export function onDataSharingConsentDetails() {
  Alert.alert('', i18n.t('data_sharing:dialog:body'));
}

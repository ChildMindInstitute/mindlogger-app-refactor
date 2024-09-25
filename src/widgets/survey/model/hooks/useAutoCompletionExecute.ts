import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import {
  AutocompletionExecuteOptions,
  LogAutocompletionTrigger,
} from '@app/abstract/lib/types/autocompletion';
import { useCurrentRoute } from '@app/shared/lib/hooks/useCurrentRoute';
import { useIsOnline } from '@app/shared/lib/hooks/useIsOnline';
import { getDefaultUploadObservable } from '@app/shared/lib/observables/uploadObservableInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { getMutexDefaultInstanceManager } from '@app/shared/lib/utils/mutexDefaultInstanceManagerInstance';

import { useAutoCompletion } from './useAutoCompletion';

const CompleteCurrentNavigationDelay = 500;

export const useAutoCompletionExecute = () => {
  const { getCurrentRoute } = useCurrentRoute();

  const navigation = useNavigation();

  const { hasExpiredEntity, evaluateIfItemsInQueueExist } = useAutoCompletion();

  const isOffline = !useIsOnline();

  const autocomplete = useCallback(
    (
      logTrigger: LogAutocompletionTrigger,
      options?: AutocompletionExecuteOptions,
    ) => {
      const {
        checksToExclude: checksToExcludeOptional,
        checksToInclude: checksToIncludeOptional,
        forceUpload,
      } = options ?? {};

      const checksToExclude = checksToExcludeOptional ?? [];

      const checksToInclude = checksToIncludeOptional ?? [];

      const currentRoute = getCurrentRoute();

      const isActivityExecuting = currentRoute === 'InProgressActivity';

      const isAlreadyOpened = currentRoute === 'Autocompletion';

      const isUploading = getDefaultUploadObservable().isLoading;

      const hasItemsInQueue = evaluateIfItemsInQueueExist();

      getDefaultLogger().log(
        `[useAutoCompletionExecute.autocomplete] Started, logTrigger="${logTrigger}", forceUpload="${forceUpload}", checksToExclude=${JSON.stringify(checksToExclude)}, checksToInclude=${JSON.stringify(checksToInclude)}, hasItemsInQueue=${hasItemsInQueue}`,
      );

      if (checksToInclude.includes('is-offline') && isOffline) {
        getDefaultLogger().info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to offline',
        );
        return;
      }

      if (
        !checksToExclude.includes('in-progress-activity') &&
        isActivityExecuting
      ) {
        getDefaultLogger().info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to entity is in progress',
        );
        return;
      }

      if (!checksToExclude.includes('uploading') && isUploading) {
        getDefaultLogger().info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to is currently uploading',
        );
        return;
      }

      if (!checksToExclude.includes('already-opened') && isAlreadyOpened) {
        getDefaultLogger().info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to already opened',
        );
        return;
      }

      if (
        !checksToExclude.includes('refresh') &&
        getMutexDefaultInstanceManager().getRefreshServiceMutex().isBusy()
      ) {
        getDefaultLogger().info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to RefreshService.mutex is busy',
        );
        return;
      }

      if (
        !checksToExclude.includes('start-entity') &&
        getMutexDefaultInstanceManager().getStartEntityMutex().isBusy()
      ) {
        getDefaultLogger().log(
          '[useAutoCompletionExecute.startActivityOrFlow] Postponed due to StartEntityMutex is busy',
        );
        return;
      }

      getDefaultUploadObservable().reset();

      const closingInProgressEntityScreen = checksToExclude.includes(
        'in-progress-activity',
      );

      setTimeout(
        () => {
          if (hasExpiredEntity() || (forceUpload && hasItemsInQueue)) {
            navigation.navigate('Autocompletion');
          }
        },
        closingInProgressEntityScreen ? CompleteCurrentNavigationDelay : 0,
      );
    },
    [
      evaluateIfItemsInQueueExist,
      getCurrentRoute,
      hasExpiredEntity,
      isOffline,
      navigation,
    ],
  );

  return {
    executeAutocompletion: autocomplete,
  };
};

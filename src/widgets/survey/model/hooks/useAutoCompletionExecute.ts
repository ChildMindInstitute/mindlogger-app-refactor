import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import {
  AutocompletionExecuteOptions,
  LogAutocompletionTrigger,
} from '@app/abstract/lib';
import { AppletModel } from '@app/entities/applet';
import { Logger, UploadObservable, useCurrentRoute } from '@app/shared/lib';

import { useAutoCompletion } from './';

const CompleteCurrentNavigationDelay = 500;

const useAutoCompletionExecute = () => {
  const { getCurrentRoute } = useCurrentRoute();

  const navigation = useNavigation();

  const { hasExpiredEntity, evaluateIfItemsInQueueExist } = useAutoCompletion();

  const autocomplete = useCallback(
    (
      logTrigger: LogAutocompletionTrigger,
      options?: AutocompletionExecuteOptions,
    ) => {
      const { checksToExclude: checksToExcludeOptional, forceUpload } =
        options ?? {};

      const checksToExclude = checksToExcludeOptional ?? [];

      const currentRoute = getCurrentRoute();

      const isActivityExecuting = currentRoute === 'InProgressActivity';

      const isAlreadyOpened = currentRoute === 'Autocompletion';

      const isUploading = UploadObservable.isLoading;

      const hasItemsInQueue = evaluateIfItemsInQueueExist();

      Logger.log(
        `[useAutoCompletionExecute.autocomplete] Started, logTrigger="${logTrigger}", forceUpload="${forceUpload}", checksToExclude=${JSON.stringify(checksToExclude)}, hasItemsInQueue=${hasItemsInQueue}`,
      );

      if (
        !checksToExclude.includes('in-progress-activity') &&
        isActivityExecuting
      ) {
        Logger.info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to entity is in progress',
        );
        return;
      }

      if (!checksToExclude.includes('uploading') && isUploading) {
        Logger.info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to is currently uploading',
        );
        return;
      }

      if (!checksToExclude.includes('already-opened') && isAlreadyOpened) {
        Logger.info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to already opened',
        );
        return;
      }

      if (
        !checksToExclude.includes('refresh') &&
        AppletModel.RefreshService.isBusy()
      ) {
        Logger.info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to RefreshService.mutex is busy',
        );
        return;
      }

      if (
        !checksToExclude.includes('start-entity') &&
        AppletModel.StartEntityMutex.isBusy()
      ) {
        Logger.log(
          '[useAutoCompletionExecute.startActivityOrFlow] Postponed due to StartEntityMutex is busy',
        );
        return;
      }

      UploadObservable.reset();

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
      navigation,
    ],
  );

  return {
    executeAutocompletion: autocomplete,
  };
};

export default useAutoCompletionExecute;

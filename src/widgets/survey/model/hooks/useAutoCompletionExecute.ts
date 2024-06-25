import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { AppletModel } from '@app/entities/applet';
import { Logger, useCurrentRoute } from '@app/shared/lib';

import { useAutoCompletion } from './';

type SafeChecks = 'in-progress-activity' | 'refresh' | 'start-entity';

const CompleteCurrentNavigationDelay = 500;

export type AutocompletionExecuteOptions = {
  checksToExclude: Array<SafeChecks>;
  considerUploadQueue?: boolean;
};

const useAutoCompletionExecute = () => {
  const { getCurrentRoute } = useCurrentRoute();

  const navigation = useNavigation();

  const { hasExpiredEntity, hasItemsInQueue } = useAutoCompletion();

  const autocomplete = useCallback(
    (options: AutocompletionExecuteOptions = { checksToExclude: [] }) => {
      const { checksToExclude } = options;

      const currentRoute = getCurrentRoute();

      const executing = currentRoute === 'InProgressActivity';

      const alreadyOpened = currentRoute === 'Autocompletion';

      Logger.log(
        `[useAutoCompletionExecute.autocomplete] Started, options:\n${JSON.stringify(options, null, 2)}`,
      );

      if (!checksToExclude.includes('in-progress-activity') && executing) {
        Logger.info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to entity is in progress',
        );
        return;
      }

      if (alreadyOpened) {
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

      const closingInProgressEntityScreen = checksToExclude.includes(
        'in-progress-activity',
      );

      setTimeout(
        () => {
          if (
            hasExpiredEntity() ||
            (options.considerUploadQueue && hasItemsInQueue)
          ) {
            navigation.navigate('Autocompletion');
          }
        },
        closingInProgressEntityScreen ? CompleteCurrentNavigationDelay : 0,
      );
    },
    [getCurrentRoute, hasExpiredEntity, hasItemsInQueue, navigation],
  );

  return {
    executeAutocompletion: autocomplete,
  };
};

export default useAutoCompletionExecute;

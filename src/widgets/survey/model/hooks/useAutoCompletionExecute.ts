import { useCallback } from 'react';

import { AppletModel } from '@app/entities/applet';
import { Logger, useCurrentRoute } from '@app/shared/lib';

import { useAutoCompletion } from './';

type SafeChecks = 'in-progress-activity' | 'refresh' | 'start-entity';

export type AutocompletionExecuteOptions = {
  checksToExclude: Array<SafeChecks>;
};

const useAutoCompletionExecute = () => {
  const { getCurrentRoute } = useCurrentRoute();

  const { process: processAutocompletion } = useAutoCompletion();

  const autocomplete = useCallback(
    async (options: AutocompletionExecuteOptions = { checksToExclude: [] }) => {
      const { checksToExclude } = options;

      const executing = getCurrentRoute() === 'InProgressActivity';

      Logger.log('[useAutoCompletionExecute.autocomplete] Started');

      if (!checksToExclude.includes('in-progress-activity') && executing) {
        Logger.info(
          '[useAutoCompletionExecute.autocomplete]: Postponed due to entity is in progress',
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

      await processAutocompletion();
    },
    [getCurrentRoute, processAutocompletion],
  );

  return {
    executeAutocompletion: autocomplete,
  };
};

export default useAutoCompletionExecute;

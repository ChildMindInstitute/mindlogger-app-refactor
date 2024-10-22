import { useState } from 'react';

import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import { MixEvents } from '@app/shared/lib/analytics/IAnalyticsService';
import { getDefaultUploadObservable } from '@app/shared/lib/observables/uploadObservableInstance';

import { showUploadErrorAlert } from '../alerts';

type Input = {
  retryUpload: () => Promise<boolean>;
  onPostpone?: () => void;
  onSuccess?: () => void;
};

type Result = {
  isAlertOpened: boolean;
  openAlert: () => void;
};

export const useRetryUpload = ({
  retryUpload,
  onPostpone: postpone,
  onSuccess: success,
}: Input): Result => {
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const openAlert = async () => {
    setIsAlertOpened(true);

    showUploadErrorAlert({
      onRetry: async () => {
        getDefaultAnalyticsService().track(MixEvents.RetryButtonPressed);
        try {
          setIsAlertOpened(false);

          const retryResult = await retryUpload();

          if (!retryResult) {
            openAlert();
          } else if (success) {
            success();
          }
        } catch {
          openAlert();
        }
      },
      onLater: () => {
        setIsAlertOpened(false);

        getDefaultUploadObservable().isPostponed = true;

        if (postpone) {
          postpone();
        }
      },
    });
  };

  return {
    isAlertOpened,
    openAlert,
  };
};

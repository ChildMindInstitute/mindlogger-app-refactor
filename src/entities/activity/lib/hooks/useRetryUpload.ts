import { useState } from 'react';

import { AnalyticsService } from '@shared/lib';

import { showUploadErrorAlert } from '../alerts';
import { UploadObservable } from '../observables';

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
        AnalyticsService.track('Retry button pressed');
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

        UploadObservable.isPostponed = true;

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

import { useCallback, useRef, useState } from 'react';

import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

type UseUnityFailureHandlerOptions = {
  flowId: string | undefined;
  stopHeartbeat: () => void;
  onError?: () => void;
};

export const useUnityFailureHandler = ({
  flowId,
  stopHeartbeat,
  onError,
}: UseUnityFailureHandlerOptions) => {
  const logger = getDefaultLogger();
  const errorHandledRef = useRef<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const triggerFailure = useCallback(() => {
    if (errorHandledRef.current) {
      return;
    }
    errorHandledRef.current = true;

    const isFlow = !!flowId;
    logger.warn(`[FailureHandler] triggerFailure called, isFlow=${isFlow}`);

    stopHeartbeat();
    setShowErrorModal(true);
  }, [flowId, logger, stopHeartbeat]);

  const handleErrorModalDismiss = useCallback(() => {
    setShowErrorModal(false);

    if (flowId) {
      logger.log(
        '[UnityView] Flow mode — calling onError to skip failed activity',
      );
    } else {
      logger.log(
        '[UnityView] Standalone mode — calling onError to navigate back',
      );
    }
    onError?.();
  }, [flowId, logger, onError]);

  // Call in the unmount cleanup to prevent post-teardown error handling.
  const suppressErrors = useCallback(() => {
    logger.log('[UnityView] Unmounting — suppressing future error handling');
    errorHandledRef.current = true;
  }, [logger]);

  return {
    showErrorModal,
    triggerFailure,
    handleErrorModalDismiss,
    suppressErrors,
  };
};

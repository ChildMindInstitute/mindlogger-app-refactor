import { useCallback, useRef, useState } from 'react';

import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { UnityResult } from '../types/unityType';

type UseUnityFailureHandlerOptions = {
  flowId: string | undefined;
  stopHeartbeat: () => void;
  onResponse?: (response: UnityResult) => void;
  onError?: () => void;
};

export const useUnityFailureHandler = ({
  flowId,
  stopHeartbeat,
  onResponse,
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
        '[UnityView] Flow mode — submitting empty result to advance',
      );
      onResponse?.({
        responseType: 'unity',
        startTime: 0,
        taskData: [],
      });
    } else {
      logger.log(
        '[UnityView] Standalone mode — calling onError to navigate back',
      );
      onError?.();
    }
  }, [flowId, logger, onResponse, onError]);

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

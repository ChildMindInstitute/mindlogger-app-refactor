import { useCallback, useRef, useState } from 'react';

import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import {
  UseUnityFailureHandlerOptions,
  UseUnityFailureHandlerResult,
} from '../types/unityType';

export const useUnityFailureHandler = ({
  flowId,
  stopHeartbeat,
  onError,
}: UseUnityFailureHandlerOptions): UseUnityFailureHandlerResult => {
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
    onError?.();
  }, [onError]);

  const resetFailureState = useCallback(() => {
    errorHandledRef.current = false;
    setShowErrorModal(false);
  }, []);

  // Call in the unmount cleanup to prevent post-teardown error handling.
  const suppressErrors = useCallback(() => {
    errorHandledRef.current = true;
  }, []);

  return {
    showErrorModal,
    triggerFailure,
    handleErrorModalDismiss,
    resetFailureState,
    suppressErrors,
  };
};

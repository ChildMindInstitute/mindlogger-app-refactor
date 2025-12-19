import { useState, useMemo, useCallback, useRef } from 'react';

import { MfaApiError, MfaErrorMetadata } from '@app/shared/types/mfaMetadata';

export interface UseMfaAttemptsTrackerReturn {
  sessionAttemptsRemaining: number | null;
  globalAttemptsRemaining: number | null;
  shouldShowWarning: boolean;
  criticalLimit: 'session' | 'global' | null;
  updateFromApiError: (error: unknown) => void;
  resetAttempts: () => void;
  getWarningMessage: () => string | undefined;
  getWarningCount: () => number | null;
}

export const useMfaAttemptsTracker = (): UseMfaAttemptsTrackerReturn => {
  const [sessionAttemptsRemaining, setSessionAttemptsRemaining] = useState<
    number | null
  >(null);
  const [globalAttemptsRemaining, setGlobalAttemptsRemaining] = useState<
    number | null
  >(null);

  const requestIdRef = useRef(0);

  // Prioritize global limit when equal (more severe consequence)
  const criticalLimit = useMemo(() => {
    if (sessionAttemptsRemaining === null && globalAttemptsRemaining === null) {
      return null;
    }

    if (sessionAttemptsRemaining === null) return 'global';
    if (globalAttemptsRemaining === null) return 'session';

    if (globalAttemptsRemaining <= sessionAttemptsRemaining) {
      return 'global';
    }

    return 'session';
  }, [sessionAttemptsRemaining, globalAttemptsRemaining]);

  const shouldShowWarning = useMemo(() => {
    if (criticalLimit === 'session' && sessionAttemptsRemaining !== null) {
      return sessionAttemptsRemaining <= 3;
    }
    if (criticalLimit === 'global' && globalAttemptsRemaining !== null) {
      return globalAttemptsRemaining <= 3;
    }
    return false;
  }, [criticalLimit, sessionAttemptsRemaining, globalAttemptsRemaining]);

  const getWarningMessage = useCallback((): string | undefined => {
    if (!shouldShowWarning || !criticalLimit) return undefined;

    if (criticalLimit === 'session') {
      return 'mfa_verification:warning_session_attempts_remaining';
    }

    return 'mfa_verification:warning_global_attempts_remaining';
  }, [shouldShowWarning, criticalLimit]);

  const getWarningCount = useCallback((): number | null => {
    if (!shouldShowWarning || !criticalLimit) return null;

    return criticalLimit === 'session'
      ? sessionAttemptsRemaining
      : globalAttemptsRemaining;
  }, [
    shouldShowWarning,
    criticalLimit,
    sessionAttemptsRemaining,
    globalAttemptsRemaining,
  ]);

  const updateFromApiError = useCallback((error: unknown) => {
    const currentRequestId = ++requestIdRef.current;

    const apiError = error as MfaApiError;
    const metadata: MfaErrorMetadata | undefined =
      apiError?.response?.data?.metadata;

    if (!metadata) {
      return;
    }

    // Prevent race conditions
    if (currentRequestId === requestIdRef.current) {
      if (metadata.session_attempts_remaining !== undefined) {
        setSessionAttemptsRemaining(metadata.session_attempts_remaining);
      }

      if (metadata.global_attempts_remaining !== undefined) {
        setGlobalAttemptsRemaining(metadata.global_attempts_remaining);
      }
    }
  }, []);

  const resetAttempts = useCallback(() => {
    setSessionAttemptsRemaining(null);
    setGlobalAttemptsRemaining(null);
    requestIdRef.current = 0;
  }, []);

  return {
    sessionAttemptsRemaining,
    globalAttemptsRemaining,
    shouldShowWarning,
    criticalLimit,
    updateFromApiError,
    resetAttempts,
    getWarningMessage,
    getWarningCount,
  };
};

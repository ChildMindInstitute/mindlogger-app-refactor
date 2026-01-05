import { useState, useRef, useEffect } from 'react';

import { UseFormReturn } from 'react-hook-form';

import {
  SESSION_EXPIRY_THRESHOLD_MS,
  AUTO_SUBMIT_DELAY_MS,
  TOTP_CODE_LENGTH,
} from '@app/shared/lib/constants/mfa';

interface UseAutoSubmitOptions {
  verificationCode: string;
  isLoading: boolean;
  sessionExpired: boolean;
  form: UseFormReturn<{ verificationCode: string }>;
  submit: () => Promise<void>;
  onSessionExpiry: (warning: string) => void;
}

interface UseAutoSubmitReturn {
  isAutoSubmitting: boolean;
  sessionExpiryWarning: string | undefined;
}

/**
 * Custom hook to handle auto-submit logic for MFA verification
 *
 * Features:
 * - Auto-submits when 6 digits are entered
 * - 300ms delay for better UX
 * - Session expiry threshold (4.5 minutes)
 * - Double-submit prevention
 * - Validation before submit
 * - Proper timer cleanup
 *
 * @param options - Configuration options for auto-submit behavior
 * @returns Auto-submit state and warnings
 */
export const useAutoSubmit = ({
  verificationCode,
  isLoading,
  sessionExpired,
  form,
  submit,
  onSessionExpiry,
}: UseAutoSubmitOptions): UseAutoSubmitReturn => {
  // Track when screen was loaded to check session expiry
  const screenLoadTime = useRef(Date.now());

  // Track auto-submit state using refs to avoid closure issues
  const isAutoSubmittingRef = useRef(false);
  const hasAutoSubmittedRef = useRef(false);
  const [sessionExpiryWarning, setSessionExpiryWarning] = useState<
    string | undefined
  >();
  const autoSubmitTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-submit logic when 6 digits are entered
  useEffect(() => {
    // Clear any existing timer
    if (autoSubmitTimerRef.current) {
      clearTimeout(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }

    // Reset warning and auto-submit state when code is cleared or modified
    if (!verificationCode || verificationCode.length < TOTP_CODE_LENGTH) {
      setSessionExpiryWarning(undefined);
      hasAutoSubmittedRef.current = false;
      return;
    }

    // Only auto-submit if:
    // 1. Code is exactly 6 digits
    // 2. Not already loading
    // 3. Not already auto-submitted for this code
    // 4. Session hasn't been marked as expired
    if (
      verificationCode.length === TOTP_CODE_LENGTH &&
      !isLoading &&
      !isAutoSubmittingRef.current &&
      !hasAutoSubmittedRef.current &&
      !sessionExpired
    ) {
      // Check if session might be expired (4.5 minute threshold)
      const timeElapsed = Date.now() - screenLoadTime.current;

      if (timeElapsed > SESSION_EXPIRY_THRESHOLD_MS) {
        // Session might be expired, show warning instead of auto-submitting
        const warning = 'mfa_verification:session_expiry_warning';
        setSessionExpiryWarning(warning);
        onSessionExpiry(warning);
        return;
      }

      // Validate the code format before auto-submitting
      form
        .trigger('verificationCode')
        .then(isValid => {
          if (!isValid) {
            return; // Invalid format, don't auto-submit
          }

          // Set refs to prevent double submission
          isAutoSubmittingRef.current = true;
          hasAutoSubmittedRef.current = true;

          // Delay auto-submit slightly for better UX (user can see the complete code)
          autoSubmitTimerRef.current = setTimeout(() => {
            submit()
              .catch(console.error)
              .finally(() => {
                isAutoSubmittingRef.current = false;
              });
          }, AUTO_SUBMIT_DELAY_MS);
        })
        .catch(console.error);
    }

    // Cleanup timeout on unmount
    return () => {
      if (autoSubmitTimerRef.current) {
        clearTimeout(autoSubmitTimerRef.current);
      }
    };
  }, [
    verificationCode,
    isLoading,
    sessionExpired,
    form,
    submit,
    onSessionExpiry,
  ]);

  return {
    isAutoSubmitting: isAutoSubmittingRef.current,
    sessionExpiryWarning,
  };
};

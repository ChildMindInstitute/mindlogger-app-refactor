import { useEffect } from 'react';

import { UseFormReturn } from 'react-hook-form';

interface UseMfaErrorSyncParams {
  error?: string;
  attemptsWarning?: string;
  form: UseFormReturn<any>;
  fieldName: string;
  onErrorClear?: () => void;
  fieldValue: string;
  clearThreshold: number;
}

/**
 * Custom hook to sync API errors with form field errors and handle error clearing
 * Combines error messages with attempts warning when present
 */
export const useMfaErrorSync = ({
  error,
  attemptsWarning,
  form,
  fieldName,
  onErrorClear,
  fieldValue,
  clearThreshold,
}: UseMfaErrorSyncParams) => {
  // Sync external API error to form field error, combining with attempts warning
  useEffect(() => {
    if (error) {
      // Combine error with attempts warning if present
      const combinedMessage = attemptsWarning
        ? `${error} ${attemptsWarning}`
        : error;

      form.setError(fieldName, {
        type: 'manual',
        message: combinedMessage,
      });
    } else {
      // Clear the error if error prop is cleared
      form.clearErrors(fieldName);
    }
  }, [error, attemptsWarning, form, fieldName]);

  // Clear API error (not validation errors) when user starts typing
  useEffect(() => {
    // Only clear if there's an API error from parent and user is modifying the code
    if (error && fieldValue && fieldValue.length < clearThreshold) {
      // Clear the parent's error state
      onErrorClear?.();
    }
  }, [fieldValue, error, onErrorClear, clearThreshold]);
};

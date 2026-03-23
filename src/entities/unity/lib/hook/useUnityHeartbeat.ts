import { useCallback, useRef } from 'react';

import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';

import { newEchoMessage } from './useRNUnityCommBridge';
import {
  HEARTBEAT_INTERVAL_MS,
  HEARTBEAT_TIMEOUT_MS,
  MAX_HEARTBEAT_FAILURES,
} from '../constants';
import { RN2UMessage, U2RNMessage } from '../types/unityMessage';

type UseUnityHeartbeatOptions = {
  sendMessageToUnity: (message: RN2UMessage) => Promise<U2RNMessage | null>;
  onFirstFailure?: () => void;
  onMaxFailuresReached?: () => void;
};

//Provides startHeartbeat and stopHeartbeat for periodic Echo monitoring of Unity bridge responsiveness.
// Call startHeartbeat after Unity is ready; stopHeartbeat on unmount or activity end.
export const useUnityHeartbeat = ({
  sendMessageToUnity,
  onFirstFailure,
  onMaxFailuresReached,
}: UseUnityHeartbeatOptions) => {
  const logger: ILogger = getDefaultLogger();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const failureCountRef = useRef<number>(0);
  const firedRef = useRef<boolean>(false);

  const stopHeartbeat = useCallback(() => {
    if (intervalRef.current) {
      logger.log('[UnityView] Stopping heartbeat');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [logger]);

  const startHeartbeat = useCallback(() => {
    // Clear any existing heartbeat before starting a new one
    stopHeartbeat();
    failureCountRef.current = 0;
    firedRef.current = false;

    logger.log('[UnityView] Starting periodic heartbeat');

    const handleFailure = (reason: string) => {
      failureCountRef.current += 1;
      logger.warn(
        `[Heartbeat] failure #${failureCountRef.current}/${MAX_HEARTBEAT_FAILURES}: ${reason}`,
      );

      if (failureCountRef.current === 1) {
        onFirstFailure?.();
      }

      if (
        failureCountRef.current >= MAX_HEARTBEAT_FAILURES &&
        !firedRef.current
      ) {
        firedRef.current = true;
        stopHeartbeat();
        onMaxFailuresReached?.();
      }
    };

    intervalRef.current = setInterval(() => {
      const echoPayload = `heartbeat-${Date.now()}`;
      const echoMsg = newEchoMessage(echoPayload);
      logger.log('[Heartbeat] sending Echo tick');

      const timeoutId = setTimeout(() => {
        handleFailure(`Echo timed out after ${HEARTBEAT_TIMEOUT_MS}ms`);
      }, HEARTBEAT_TIMEOUT_MS);

      sendMessageToUnity(echoMsg)
        .then(() => {
          clearTimeout(timeoutId);
          failureCountRef.current = 0;
        })
        .catch(err => {
          clearTimeout(timeoutId);
          handleFailure(`Echo send failed: ${err}`);
        });
    }, HEARTBEAT_INTERVAL_MS);
  }, [
    logger,
    sendMessageToUnity,
    stopHeartbeat,
    onFirstFailure,
    onMaxFailuresReached,
  ]);

  return { startHeartbeat, stopHeartbeat };
};

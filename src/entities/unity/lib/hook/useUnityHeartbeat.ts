import { useCallback, useRef } from 'react';

import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';

import {
  HEARTBEAT_INTERVAL_MS,
  HEARTBEAT_TIMEOUT_MS,
  MAX_HEARTBEAT_FAILURES,
} from '../constants';
import { newEchoMessage } from './useRNUnityCommBridge';
import { RN2UMessage, U2RNMessage } from '../types/unityMessage';

type UseUnityHeartbeatOptions = {
  sendMessageToUnity: (message: RN2UMessage) => Promise<U2RNMessage | null>;
  onMaxFailuresReached?: () => void;
};


//Provides startHeartbeat and stopHeartbeat for periodic Echo monitoring of Unity bridge responsiveness.
// Call startHeartbeat after Unity is ready; stopHeartbeat on unmount or activity end.
export const useUnityHeartbeat = ({
  sendMessageToUnity,
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
        `[UnityView] Heartbeat failure ${failureCountRef.current}/${MAX_HEARTBEAT_FAILURES}: ${reason}`,
      );

      if (
        failureCountRef.current >= MAX_HEARTBEAT_FAILURES &&
        !firedRef.current
      ) {
        firedRef.current = true;
        logger.warn(
          '[UnityView] Max heartbeat failures reached — triggering error flow',
        );
        stopHeartbeat();
        onMaxFailuresReached?.();
      }
    };

    intervalRef.current = setInterval(() => {
      const echoPayload = `heartbeat-${Date.now()}`;
      const echoMsg = newEchoMessage(echoPayload);

      const timeoutId = setTimeout(() => {
        handleFailure(
          `Echo timed out after ${HEARTBEAT_TIMEOUT_MS}ms`,
        );
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
  }, [logger, sendMessageToUnity, stopHeartbeat, onMaxFailuresReached]);

  return { startHeartbeat, stopHeartbeat };
};

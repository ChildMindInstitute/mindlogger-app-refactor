import { useCallback, useRef } from 'react';

import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';

import {
  HEARTBEAT_INTERVAL_MS,
  HEARTBEAT_TIMEOUT_MS,
} from '../constants';
import { newEchoMessage } from './useRNUnityCommBridge';
import { RN2UMessage, U2RNMessage } from '../types/unityMessage';

type UseUnityHeartbeatOptions = {
  sendMessageToUnity: (message: RN2UMessage) => Promise<U2RNMessage | null>;
};


//Provides startHeartbeat and stopHeartbeat for periodic Echo monitoring of Unity bridge responsiveness.
// Call startHeartbeat after Unity is ready; stopHeartbeat on unmount or activity end.
export const useUnityHeartbeat = ({
  sendMessageToUnity,
}: UseUnityHeartbeatOptions) => {
  const logger: ILogger = getDefaultLogger();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopHeartbeat = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    // Clear any existing heartbeat before starting a new one
    stopHeartbeat();

    logger.log('[UnityView] Starting periodic heartbeat');

    intervalRef.current = setInterval(() => {
      const echoPayload = `heartbeat-${Date.now()}`;
      const echoMsg = newEchoMessage(echoPayload);

      const timeoutId = setTimeout(() => {
        logger.warn(
          `[UnityView] Heartbeat Echo timed out after ${HEARTBEAT_TIMEOUT_MS}ms — Unity may be unresponsive`,
        );
      }, HEARTBEAT_TIMEOUT_MS);

      sendMessageToUnity(echoMsg)
        .then(() => {
          clearTimeout(timeoutId);
        })
        .catch(err => {
          clearTimeout(timeoutId);
          logger.warn(`[UnityView] Heartbeat Echo failed: ${err}`);
        });
    }, HEARTBEAT_INTERVAL_MS);
  }, [logger, sendMessageToUnity, stopHeartbeat]);

  return { startHeartbeat, stopHeartbeat };
};

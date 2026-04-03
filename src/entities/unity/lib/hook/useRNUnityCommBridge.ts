import { RefObject, useCallback, useRef } from 'react';

import RNUnityView from '@azesmway/react-native-unity';
import { v4 as uuidv4 } from 'uuid';

import { withAdditionalInfo } from '@app/shared/lib/services/Logger';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';

import {
  RN2UMessage,
  U2RNMessage,
  UnityEvent,
} from '../../lib/types/unityMessage';

export const newEchoMessage = (payload: string): RN2UMessage => {
  return {
    m_sId: uuidv4(),
    m_sKey: 'Echo',
    m_sAdditionalInfo: payload,
  };
};

export type RNUnityCommBridgeUnityEventHandler = (message: U2RNMessage) => void;

type RNUnityCommBridgeOptions = {
  rnUnityViewRef: RefObject<RNUnityView | null>;
};

export const useRNUnityCommBridge = ({
  rnUnityViewRef,
}: RNUnityCommBridgeOptions) => {
  const logger: ILogger = getDefaultLogger();

  const eventHandlersRef = useRef<
    Partial<Record<UnityEvent, RNUnityCommBridgeUnityEventHandler>>
  >({});
  const inFlightMessagesRef = useRef<
    Record<string, [(value: U2RNMessage | null) => void, (err: Error) => void]>
  >({});

  const sendMessageToUnity = useCallback(
    async (message: RN2UMessage): Promise<U2RNMessage | null> => {
      let resolvePromise: ((value: U2RNMessage | null) => void) | undefined;
      let rejectPromise: ((err: Error) => void) | undefined;
      const promise = new Promise<U2RNMessage | null>((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
      });

      if (!resolvePromise || !rejectPromise) {
        // This should in theory never happen. But if we code it this way, we
        // can make TypeScript happy without using `?` or `!`.
        return Promise.reject(
          new Error('Error creating promise resolver/rejector'),
        );
      }

      if (rnUnityViewRef.current) {
        // If there is a message ID (there should always be one, but we should
        // still check just in case), then save the promise resolver/rejector
        // for later use.
        if (message.m_sId) {
          inFlightMessagesRef.current[message.m_sId] = [
            resolvePromise,
            rejectPromise,
          ];
        }

        logger.log(
          withAdditionalInfo(
            `[RNUnityCommBridge] Sending ${message.m_sKey} message to Unity`,
            message.m_sAdditionalInfo,
          ),
          message,
        );
        rnUnityViewRef.current.postMessage(
          'ReactCommunicationBridge',
          'ReceiveReactMessage',
          JSON.stringify(message),
        );

        // If there is no message ID (there should always be one, but we should
        // still check just in case), then immediately resolve the promise.
        if (!message.m_sId) {
          resolvePromise(null);
        }
      } else {
        logger.warn(
          withAdditionalInfo(
            `[RNUnityCommBridge] RNUnityView not ready. Not sending ${message.m_sKey} message to Unity`,
            message.m_sAdditionalInfo,
          ),
          message,
        );
        rejectPromise(new Error('RNUnityView not ready'));
      }

      return promise.then(response => {
        logger.log(
          withAdditionalInfo(
            `[RNUnityCommBridge] Sent ${message.m_sKey} message to Unity`,
            response?.m_sAdditionalInfo,
          ),
          response ?? undefined,
        );
        return response;
      });
    },
    [logger, rnUnityViewRef],
  );

  const registerEventHandler = useCallback(
    (evtType: UnityEvent, handler: RNUnityCommBridgeUnityEventHandler) => {
      eventHandlersRef.current[evtType] = handler;
    },
    [],
  );

  const handleMessageFromUnity = useCallback(
    (messageString: string) => {
      let message: U2RNMessage | null;
      try {
        message = JSON.parse(messageString) as U2RNMessage;
      } catch (err) {
        // Log error on messages that cannot be parsed
        logger.error(
          `[RNUnityCommBridge] Error parsing message from Unity: ${(err as Error).message}`,
          { messageString },
        );
        message = null;
      }
      if (message) {
        const handler = eventHandlersRef.current[message.m_sKey];
        const promiseFns = message.m_sId
          ? inFlightMessagesRef.current[message.m_sId]
          : null;

        // Call registered handler before resolving promises
        if (handler) {
          logger.log(
            withAdditionalInfo(
              `[RNUnityCommBridge] Handling ${message.m_sKey} message from Unity`,
              message.m_sAdditionalInfo,
            ),
            message,
          );
          handler(message);
        }

        // Attempt to resolve any pending promises
        if (promiseFns) {
          const [resolvePromise] = promiseFns;

          // Allow promise consumer to log message
          resolvePromise(message);
          // Clear the saved promise resolver/rejector after use
          delete inFlightMessagesRef.current[message.m_sId];
        }

        // Log messages without handler or resolved promise
        if (!handler && !promiseFns) {
          logger.log(
            withAdditionalInfo(
              `[RNUnityCommBridge] Received ${message.m_sKey} message from Unity`,
              message.m_sAdditionalInfo,
            ),
            message,
          );
        }
      }
    },
    [logger],
  );

  return { sendMessageToUnity, registerEventHandler, handleMessageFromUnity };
};

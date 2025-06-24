import { RefObject, useCallback, useRef } from 'react';

import RNUnityView from '@azesmway/react-native-unity';
import { v4 as uuidv4 } from 'uuid';

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
    Partial<Record<UnityEvent, RNUnityCommBridgeUnityEventHandler[]>>
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

        const messagePayload = [
          'ReactCommunicationBridge',
          'ReceiveReactMessage',
          JSON.stringify(message),
        ] as [string, string, string];
        logger.log(
          `[RNUnityCommBridge] Sending message to Unity: ${JSON.stringify(messagePayload)}`,
        );
        rnUnityViewRef.current.postMessage(...messagePayload);

        // If there is not a message ID (there should always be one, but we
        // should still check just in case), then immediately resolve the
        // promise.
        if (!message.m_sId) {
          resolvePromise(null);
        }
      } else {
        logger.warn(
          `[RNUnityCommBridge] RNUnityView not ready. Not sending message: ${JSON.stringify(message)}`,
        );
        rejectPromise(new Error('RNUnityView not ready'));
      }

      return promise;
    },
    [logger, rnUnityViewRef],
  );

  const registerEventHandler = useCallback(
    (evtType: UnityEvent, handler: RNUnityCommBridgeUnityEventHandler) => {
      eventHandlersRef.current[evtType] =
        eventHandlersRef.current[evtType] || [];
      (
        eventHandlersRef.current[
          evtType
        ] as RNUnityCommBridgeUnityEventHandler[]
      ).push(handler);
    },
    [],
  );

  const handleMessageFromUnity = useCallback(
    (messageString: string) => {
      logger.info(
        `[RNUnityCommBridge] Received message string from Unity: ${messageString}`,
      );

      let message: U2RNMessage | null;
      try {
        message = JSON.parse(messageString) as U2RNMessage;
      } catch (err) {
        logger.error(
          `[RNUnityCommBridge] Error parsing message from Unity: ${(err as Error).message}`,
        );
        message = null;
      }
      if (message) {
        // Call registered handler before resolving promises.
        const handlers = eventHandlersRef.current[message.m_sKey] || [];
        for (const handler of handlers) {
          handler(message);
        }

        if (message.m_sId) {
          // For messages with message ID (there should always be one, but we
          // should still check just in case), attempt to resolve any pending
          // promises.
          const promiseFns = inFlightMessagesRef.current[message.m_sId];
          if (promiseFns) {
            const [resolvePromise] = promiseFns;
            resolvePromise(message);

            // Clear the saved promise resolver/rejector after use
            delete inFlightMessagesRef.current[message.m_sId];
          }
        }
      }
    },
    [logger],
  );

  return { sendMessageToUnity, registerEventHandler, handleMessageFromUnity };
};

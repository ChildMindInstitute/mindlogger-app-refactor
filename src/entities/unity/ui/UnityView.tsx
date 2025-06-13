import { FC, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { UIManager } from 'react-native';

import RNUnityView from '@azesmway/react-native-unity';
import { v4 as uuidv4 } from 'uuid';

import { UnityPipelineItem } from '@app/features/pass-survey/lib/types/payload';

import {
  RN2UMessage,
  U2RNMessage,
  UnityEvent,
  UnityEventUnityStarted,
} from '../lib/types/unityMessage';

type RNUnityCommBridgeOptions = {
  rnUnityViewRef: RefObject<RNUnityView>;
};

type RNUnityCommBridgeUnityEventHandler = (message: U2RNMessage) => void;

const useRNUnityCommBridge = ({ rnUnityViewRef }: RNUnityCommBridgeOptions) => {
  const eventHandlersRef = useRef<
    Partial<Record<UnityEvent, RNUnityCommBridgeUnityEventHandler[]>>
  >({});
  const inFlightMessagesRef = useRef<Record<string, RN2UMessage>>({});

  const sendMessageToUnity = useCallback(
    (message: RN2UMessage) => {
      if (rnUnityViewRef.current) {
        const messagePayload = [
          'ReactCommunicationBridge',
          'ReceiveReactMessage',
          JSON.stringify(message),
        ] as [string, string, string];
        console.log(
          '[RNUnityCommBridge] Sending message to Unity:',
          JSON.stringify(messagePayload, null, 2),
        );
        rnUnityViewRef.current.postMessage(...messagePayload);
      } else {
        console.warn(
          '[RNUnityCommBridge] RNUnityView not ready. Not sending message:',
          JSON.stringify(message, null, 2),
        );
      }
    },
    [rnUnityViewRef],
  );

  const registerEventHandler = useCallback(
    (evtType: UnityEvent, handler: RNUnityCommBridgeUnityEventHandler) => {
      eventHandlersRef.current[evtType] =
        eventHandlersRef.current[evtType] || [];
      eventHandlersRef.current[evtType].push(handler);
    },
    [],
  );

  const handleMessageFromUnity = useCallback((messageString: string) => {
    console.info(
      '[RNUnityCommBridge] Received message string from Unity:',
      messageString,
    );

    let message: U2RNMessage | null;
    try {
      message = JSON.parse(messageString) as U2RNMessage;
    } catch (err) {
      console.error(
        `[RNUnityCommBridge] Error parsing message from Unity:`,
        err,
      );
      message = null;
    }
    if (message) {
      setTimeout(() => {
        const handlers = eventHandlersRef.current[message.m_sKey] || [];
        for (const handler of handlers) {
          handler(message);
        }
      }, 100);
    }
  }, []);

  return { sendMessageToUnity, registerEventHandler, handleMessageFromUnity };
};

type Props = {
  payload: UnityPipelineItem['payload'];
};

export const UnityView: FC<Props> = props => {
  const compiledWithRNUnityView = !!(
    UIManager as never as Record<string, unknown>
  ).RNUnityView;

  const rnUnityViewRef = useRef<RNUnityView>(null);
  const [unityViewKey, setUnityViewKey] = useState<string | null>(null);
  const { sendMessageToUnity, registerEventHandler, handleMessageFromUnity } =
    useRNUnityCommBridge({ rnUnityViewRef });

  const handleUnityStarted =
    useCallback<RNUnityCommBridgeUnityEventHandler>(() => {
      console.log(
        '!!! TODO: Load activity config:',
        JSON.stringify(props.payload.file),
      );

      sendMessageToUnity({
        m_sId: 'abc-123',
        m_sKey: 'Echo',
        m_sAdditionalInfo: JSON.stringify({
          test: 'this',
          and: { that: 42 },
        }),
      });
    }, [props.payload.file, sendMessageToUnity]);

  useEffect(() => {
    // (Re)generate a new react key for the RN Unity view so it gets
    // reinitialized when this container view is rendered for the first time.
    // This ensure we can consistently get a Unity startup message.
    setUnityViewKey(uuidv4());

    registerEventHandler(UnityEventUnityStarted, handleUnityStarted);
  }, [handleUnityStarted, registerEventHandler]);

  if (!compiledWithRNUnityView) {
    // TODO: Render some dummy/placeholder UI to bypass the activity
    return null;
  } else {
    if (!unityViewKey) {
      return null;
    } else {
      return (
        <RNUnityView
          ref={rnUnityViewRef}
          style={{ flex: 1 }}
          onUnityMessage={result =>
            handleMessageFromUnity(result.nativeEvent.message)
          }
        />
      );
    }
  }
};

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { UIManager } from 'react-native';

import RNUnityView from '@azesmway/react-native-unity';
import { v4 as uuidv4 } from 'uuid';

import { UnityPipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { usePreviousValue } from '@app/shared/lib/hooks/usePreviousValue';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { Text } from '@app/shared/ui/Text';

import {
  useRNUnityCommBridge,
  RNUnityCommBridgeUnityEventHandler,
  newEchoMessage,
} from '../lib/hook/useRNUnityCommBridge';
import { UnityEventUnityStarted } from '../lib/types/unityMessage';

type Props = {
  payload: UnityPipelineItem['payload'];
};

export const UnityView: FC<Props> = props => {
  const compiledWithRNUnityView = !!(
    UIManager as never as Record<string, unknown>
  ).RNUnityView;

  const logger: ILogger = getDefaultLogger();

  const rnUnityViewRef = useRef<RNUnityView | null>(null);
  const unityReadyHandled = useRef<boolean>(false);
  const [unityViewKey, setUnityViewKey] = useState<string | null>(null);
  const unityViewKeyWas = usePreviousValue(unityViewKey);
  const { sendMessageToUnity, registerEventHandler, handleMessageFromUnity } =
    useRNUnityCommBridge({ rnUnityViewRef });

  const handleUnityReady = useCallback(() => {
    logger.log(
      `!!! TODO: Load activity config: ${JSON.stringify(props.payload.file)}`,
    );

    // const echoResponse = await sendMessageToUnity(
    //   newEchoMessage(JSON.stringify({ test: 'this', and: { that: 42 } })),
    // );
    // logger.log(`!!! echoResponse: ${JSON.stringify(echoResponse)}`);

    logger.log('!!! Waiting before sending message ...');
    setTimeout(() => {
      sendMessageToUnity(
        newEchoMessage(JSON.stringify({ test: 'this', and: { that: 42 } })),
      )
        .then(resp => {
          logger.log(`!!! Echo resp: ${JSON.stringify(resp)}`);
        })
        .catch(logger.error);
    }, 5000);
  }, [props.payload.file, logger, sendMessageToUnity]);

  // Register Unity ready handler via the `UnityStarted` event.
  const handleUnityStarted =
    useCallback<RNUnityCommBridgeUnityEventHandler>(() => {
      if (!unityReadyHandled.current) {
        unityReadyHandled.current = true;
        logger.log('[UnityView] Handling Unity ready event');
        handleUnityReady();
      } else {
        logger.log('[UnityView] Ignoring Unity ready event');
      }
    }, [logger, handleUnityReady]);
  useEffect(() => {
    registerEventHandler(UnityEventUnityStarted, handleUnityStarted);
  }, [handleUnityStarted, registerEventHandler]);

  // Register a backup Unity ready handler via a `Echo` message.
  useEffect(() => {
    if (!!unityViewKey && !unityViewKeyWas) {
      const backupCheckPayload = `BackupUnityStartedCheck:${uuidv4()}`;
      sendMessageToUnity(newEchoMessage(backupCheckPayload))
        .then(resp => {
          if (resp?.m_sAdditionalInfo === backupCheckPayload) {
            if (!unityReadyHandled.current) {
              unityReadyHandled.current = true;
              logger.log('[UnityView] Handling Unity ready backup check');
              handleUnityReady();
            } else {
              logger.log('[UnityView] Ignoring Unity ready backup check');
            }
          }
        })
        .catch(logger.error);
    }
  }, [
    sendMessageToUnity,
    handleUnityReady,
    logger,
    unityViewKey,
    unityViewKeyWas,
  ]);

  // IMPORTANT: DO NOT use this effect for anything else!
  useEffect(() => {
    // (Re)generate a new react key for the RN Unity view so it gets
    // reinitialized when this container view is rendered for the first time.
    // This ensure we can consistently get a Unity startup message.
    setUnityViewKey(uuidv4());
  }, []);

  if (!compiledWithRNUnityView) {
    // TODO: Render some dummy/placeholder UI to bypass the activity
    return (
      <Text fontSize={16} lineHeight={24}>
        RNUnityView missing from compiled binary!
      </Text>
    );
  } else {
    if (!unityViewKey) {
      return null;
    } else {
      return (
        <RNUnityView
          key={unityViewKey}
          ref={rnUnityViewRef}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ flex: 1 }}
          onUnityMessage={result => {
            handleMessageFromUnity(result.nativeEvent.message);
          }}
        />
      );
    }
  }
};

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { UIManager } from 'react-native';

import RNUnityView from '@azesmway/react-native-unity';
import * as mime from 'react-native-mime-types';
import { v4 as uuidv4 } from 'uuid';

import { UnityPipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { Text } from '@app/shared/ui/Text';
import { UnityResult } from '@entities/unity/lib/types/unityType.ts';
import { MediaFile } from '@shared/ui/survey/MediaItems/types.ts';

import {
  useRNUnityCommBridge,
  RNUnityCommBridgeUnityEventHandler,
  newEchoMessage,
} from '../lib/hook/useRNUnityCommBridge';
import {
  UnityEventEndUnity,
  UnityEventUnityStarted,
} from '../lib/types/unityMessage';

type Props = {
  payload: UnityPipelineItem['payload'];
  onResponse?: (response: UnityResult) => void;
};

export const UnityView: FC<Props> = props => {
  const compiledWithRNUnityView = !!(
    UIManager as never as Record<string, unknown>
  ).RNUnityView;

  const logger: ILogger = getDefaultLogger();

  const rnUnityViewRef = useRef<RNUnityView | null>(null);
  const unityReadyHandled = useRef<boolean>(false);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [unityViewKey, setUnityViewKey] = useState<string | null>(null);
  const { sendMessageToUnity, registerEventHandler, handleMessageFromUnity } =
    useRNUnityCommBridge({ rnUnityViewRef });
  const unityPaths = useRef<Array<string>>([]);

  logger.log(`[UnityView]: unityPaths: ${JSON.stringify(unityPaths.current)}`);

  const handleUnityReady = useCallback(async () => {
    logger.log('[UnityView] handleUnityReady — sending LoadConfigFile immediately');
    sendMessageToUnity({
      m_sId: uuidv4(),
      m_sKey: 'LoadConfigFile',
      m_sAdditionalInfo: props.payload.file ?? undefined,
    })
      .then(resp => {
        logger.log(`[UnityView] LoadConfigFile response: ${JSON.stringify(resp)}`);
      })
      .catch(err => {
        logger.error(`[UnityView] LoadConfigFile FAILED: ${err}`);
      });
  }, [props.payload.file, logger, sendMessageToUnity]);

  const HEARTBEAT_INTERVAL_MS = 5000;
  const HEARTBEAT_TIMEOUT_MS = 3000;

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    logger.log('[UnityView] Starting periodic heartbeat');

    heartbeatIntervalRef.current = setInterval(() => {
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
  }, [logger, sendMessageToUnity]);

  // Register Unity ready handler via the `UnityStarted` event.
  const handleUnityStarted =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      if (!unityReadyHandled.current) {
        unityReadyHandled.current = true;
        logger.log('[UnityView] Handling Unity ready event');
        await handleUnityReady();
        startHeartbeat();
      } else {
        logger.log('[UnityView] Ignoring Unity ready event');
      }
    }, [logger, handleUnityReady, startHeartbeat]);
  useEffect(() => {
    registerEventHandler(UnityEventUnityStarted, handleUnityStarted);
  }, [handleUnityStarted, registerEventHandler]);

  const handleEndUnity =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      logger.log('[UnityView] Handling EndUnity event');
      logger.log(
        `[UnityView] unityPaths: ${JSON.stringify(unityPaths.current)}`,
      );
      const mediaFiles: MediaFile[] = unityPaths.current.map(path => {
        const fileName = path.split('/').pop() ?? '';

        return {
          uri: `file://${path}`,
          type: mime.lookup(fileName) || '',
          fileName,
        };
      });

      logger.log(`[UnityView] mediaFiles: ${JSON.stringify(mediaFiles)}`);

      props.onResponse?.({
        responseType: 'unity',
        // TODO: Figure out what this should be
        startTime: 0,

        taskData: mediaFiles,
      });

      logger.log('[UnityView] Sending Reset message');

      await sendMessageToUnity({
        m_sId: uuidv4(),
        m_sKey: 'Reset',
      });

      logger.log('[UnityView] Sent Reset message');
    }, [logger, props, sendMessageToUnity]);
  useEffect(() => {
    registerEventHandler(UnityEventEndUnity, handleEndUnity);
  }, [handleEndUnity, registerEventHandler]);

  const handleDataExport = useCallback<RNUnityCommBridgeUnityEventHandler>(
    msg => {
      if (msg.m_sKey === 'DataExport') {
        logger.log(
          `[UnityView] Received DataExport message with paths: ${msg.m_listDataPaths.join(', ')}`,
        );

        unityPaths.current = [...unityPaths.current, ...msg.m_listDataPaths];
      }
    },
    [logger],
  );
  useEffect(() => {
    registerEventHandler('DataExport', handleDataExport);
  }, [handleDataExport, registerEventHandler]);

  // IMPORTANT: DO NOT use this effect for anything else!
  useEffect(() => {
    // (Re)generate a new react key for the RN Unity view so it gets
    // reinitialized when this container view is rendered for the first time.
    // This ensure we can consistently get a Unity startup message.
    setUnityViewKey(uuidv4());

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
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

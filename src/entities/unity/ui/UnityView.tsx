import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { UIManager } from 'react-native';

import RNUnityView from '@azesmway/react-native-unity';
import * as mime from 'react-native-mime-types';
import RNOrientationDirector, {
  Orientation,
} from 'react-native-orientation-director';
import { v4 as uuidv4 } from 'uuid';

import { UnityPipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { usePreviousValue } from '@app/shared/lib/hooks/usePreviousValue';
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
  RN2UMessage,
  UnityEventEndUnity,
  UnityEventSetOrientation,
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
  const [unityViewKey, setUnityViewKey] = useState<string | null>(null);
  const unityViewKeyWas = usePreviousValue(unityViewKey);
  const { sendMessageToUnity, registerEventHandler, handleMessageFromUnity } =
    useRNUnityCommBridge({ rnUnityViewRef });
  const unityPaths = useRef<Array<string>>([]);

  logger.log(`[UnityView]: unityPaths: ${JSON.stringify(unityPaths.current)}`);

  const handleUnityReady = useCallback(async () => {
    // TODO: Look into why this is happening.
    // We ave to wait until the loading screen appears before sending in the
    // config JSON. But for some reasons the `UnityStart` message never arrives
    // and the "backup" check below resolves too soon. So for now, to continue
    // testing we have to wait like 5 seconds for the loading screen to show.
    logger.log('[UnityView] Waiting before sending LoadConfigFile message...');
    setTimeout(() => {
      const msg: RN2UMessage = {
        m_sId: uuidv4(),
        m_sKey: 'LoadConfigFile',
        m_sAdditionalInfo: props.payload.file ?? undefined,
      };
      logger.log('[UnityView] Sending LoadConfigFile message', msg);
      sendMessageToUnity(msg)
        .then(resp => {
          logger.log(
            '[UnityView] Sent LoadConfigFile message',
            resp ?? undefined,
          );
        })
        .catch(logger.error);
    }, 5000);
  }, [props.payload.file, logger, sendMessageToUnity]);

  // Register Unity ready handler via the `UnityStarted` event.
  const handleUnityStarted =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      if (!unityReadyHandled.current) {
        unityReadyHandled.current = true;
        logger.log('[UnityView] Handling Unity ready event');
        await handleUnityReady();
      } else {
        logger.log('[UnityView] Ignoring Unity ready event');
      }
    }, [logger, handleUnityReady]);
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

      const resetMsg: RN2UMessage = {
        m_sId: uuidv4(),
        m_sKey: 'Reset',
      };
      logger.log('[UnityView] Sending Reset message', resetMsg);
      const resp = await sendMessageToUnity(resetMsg);
      logger.log('[UnityView] Sent Reset message', resp ?? undefined);
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

  // Register a backup Unity ready handler via a `Echo` message.
  useEffect(() => {
    if (!!unityViewKey && !unityViewKeyWas) {
      const backupCheckPayload = `BackupUnityStartedCheck:${uuidv4()}`;
      const msg: RN2UMessage = newEchoMessage(backupCheckPayload);
      logger.log('[UnityView] Sending Echo message', msg);
      sendMessageToUnity(msg)
        .then(resp => {
          logger.log('[UnityView] Sent Echo message', resp ?? undefined);
          if (resp?.m_sAdditionalInfo === backupCheckPayload) {
            if (!unityReadyHandled.current) {
              unityReadyHandled.current = true;
              logger.log('[UnityView] Handling Unity ready backup check');
              handleUnityReady().catch(logger.error);
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

  // Handle orientation change requests from Unity, re-lock to portrait on unmount.
  const handleSetOrientation = useCallback<RNUnityCommBridgeUnityEventHandler>(
    msg => {
      if (msg.m_sKey === 'SetOrientation') {
        const orientationValue = msg.m_sAdditionalInfo;
        logger.log(`[UnityView] Received SetOrientation: ${orientationValue}`);

        const orientationMap: Record<
          string,
          | Orientation.portrait
          | Orientation.landscapeLeft
          | Orientation.landscapeRight
        > = {
          Portrait: Orientation.portrait,
          LandscapeLeft: Orientation.landscapeLeft,
          LandscapeRight: Orientation.landscapeRight,
        };

        const orientation = orientationMap[orientationValue];
        if (orientation !== undefined) {
          RNOrientationDirector.lockTo(orientation);
        } else {
          logger.warn(
            `[UnityView] Unknown orientation value: ${orientationValue}`,
          );
        }
      }
    },
    [logger],
  );
  useEffect(() => {
    registerEventHandler(UnityEventSetOrientation, handleSetOrientation);
    return () => {
      RNOrientationDirector.lockTo(Orientation.portrait);
    };
  }, [handleSetOrientation, registerEventHandler]);

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

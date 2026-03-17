import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UIManager } from 'react-native';

import RNUnityView from '@azesmway/react-native-unity';
import * as mime from 'react-native-mime-types';
import { v4 as uuidv4 } from 'uuid';

import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { UnityPipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { Text } from '@app/shared/ui/Text';
import { UnityResult } from '@entities/unity/lib/types/unityType.ts';
import { MediaFile } from '@shared/ui/survey/MediaItems/types.ts';

import {
  useRNUnityCommBridge,
  RNUnityCommBridgeUnityEventHandler,
} from '../lib/hook/useRNUnityCommBridge';
import { useUnityHeartbeat } from '../lib/hook/useUnityHeartbeat';
import {
  UnityEventEndUnity,
  UnityEventUnityStarted,
} from '../lib/types/unityMessage';
import { UnityErrorModal } from './UnityErrorModal';

type Props = {
  payload: UnityPipelineItem['payload'];
  onResponse?: (response: UnityResult) => void;
  onError?: () => void;
};

export const UnityView: FC<Props> = props => {
  const compiledWithRNUnityView = !!(
    UIManager as never as Record<string, unknown>
  ).RNUnityView;

  const logger: ILogger = getDefaultLogger();
  const { flowId } = useContext(ActivityIdentityContext);

  const rnUnityViewRef = useRef<RNUnityView | null>(null);
  const unityReadyHandled = useRef<boolean>(false);
  const errorHandledRef = useRef<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [unityViewKey, setUnityViewKey] = useState<string | null>(null);
  const { sendMessageToUnity, registerEventHandler, handleMessageFromUnity } =
    useRNUnityCommBridge({ rnUnityViewRef });
  const unityPaths = useRef<Array<string>>([]);

  const handleUnityFailureRef = useRef<() => void>(() => {});

  const { startHeartbeat, stopHeartbeat } = useUnityHeartbeat({
    sendMessageToUnity,
    onMaxFailuresReached: () => handleUnityFailureRef.current(),
  });

  const handleUnityFailure = useCallback(() => {
    if (errorHandledRef.current) {
      return;
    }
    errorHandledRef.current = true;

    const isFlow = !!flowId;
    logger.warn(
      `[UnityView] Unity failure detected — isFlow=${isFlow}`,
    );

    stopHeartbeat();
    setShowErrorModal(true);
  }, [flowId, logger, stopHeartbeat]);

  // Keep the ref in sync so the heartbeat callback always calls the latest version
  useEffect(() => {
    handleUnityFailureRef.current = handleUnityFailure;
  }, [handleUnityFailure]);

  const handleErrorModalDismiss = useCallback(() => {
    setShowErrorModal(false);

    if (flowId) {
      logger.log(
        '[UnityView] Flow mode — submitting empty result to advance',
      );
      props.onResponse?.({
        responseType: 'unity',
        startTime: 0,
        taskData: [],
      });
    } else {
      logger.log(
        '[UnityView] Standalone mode — calling onError to navigate back',
      );
      props.onError?.();
    }
  }, [flowId, logger, props]);

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
        handleUnityFailure();
      });
  }, [props.payload.file, logger, sendMessageToUnity, handleUnityFailure]);

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
      stopHeartbeat();
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
    }, [logger, props, sendMessageToUnity, stopHeartbeat]);
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
      logger.log('[UnityView] Unmounting — suppressing future error handling');
      errorHandledRef.current = true;
      stopHeartbeat();
    };
  }, []);

  if (!compiledWithRNUnityView) {
    // TODO: Render some dummy/placeholder UI to bypass the activity
    return (
      <>
        <Text fontSize={16} lineHeight={24}>
          RNUnityView missing from compiled binary!
        </Text>
        <UnityErrorModal
          visible={showErrorModal}
          onDismiss={handleErrorModalDismiss}
        />
      </>
    );
  } else {
    if (!unityViewKey) {
      return (
        <UnityErrorModal
          visible={showErrorModal}
          onDismiss={handleErrorModalDismiss}
        />
      );
    } else {
      return (
        <>
          <RNUnityView
            key={unityViewKey}
            ref={rnUnityViewRef}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ flex: 1 }}
            onUnityMessage={result => {
              handleMessageFromUnity(result.nativeEvent.message);
            }}
          />
          <UnityErrorModal
            visible={showErrorModal}
            onDismiss={handleErrorModalDismiss}
          />
        </>
      );
    }
  }
};

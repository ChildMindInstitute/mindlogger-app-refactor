import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UIManager } from 'react-native';

import RNUnityView from '@azesmway/react-native-unity';
import * as mime from 'react-native-mime-types';
import { v4 as uuidv4 } from 'uuid';

import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { UnityPipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { Spinner } from '@app/shared/ui/Spinner';
import { Text } from '@app/shared/ui/Text';
import { UnityResult } from '@entities/unity/lib/types/unityType.ts';
import { MediaFile } from '@shared/ui/survey/MediaItems/types.ts';

import { UnityErrorModal } from './UnityErrorModal';
import {
  useRNUnityCommBridge,
  RNUnityCommBridgeUnityEventHandler,
} from '../lib/hook/useRNUnityCommBridge';
import { useUnityFailureHandler } from '../lib/hook/useUnityFailureHandler';
import { useUnityHeartbeat } from '../lib/hook/useUnityHeartbeat';
import {
  UnityEventEndUnity,
  UnityEventUnityStarted,
} from '../lib/types/unityMessage';

type Props = {
  payload: UnityPipelineItem['payload'];
  onResponse?: (response: UnityResult) => void;
  onError?: () => void;
  nextActivityName?: string;
};

const unityRuntimeState = {
  quitInProcess: false,
};

type UnityFailureMode = 'unloaded' | 'quit';

export const UnityView: FC<Props> = props => {
  const compiledWithRNUnityView = !!(
    UIManager as never as Record<string, unknown>
  ).RNUnityView;

  const logger: ILogger = getDefaultLogger();
  const { flowId } = useContext(ActivityIdentityContext);

  const rnUnityViewRef = useRef<RNUnityView | null>(null);
  const quitObservedInThisMountRef = useRef<boolean>(false);
  const unityReadyHandled = useRef<boolean>(false);
  const restartInProgressRef = useRef<boolean>(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [unityViewKey, setUnityViewKey] = useState<string | null>(null);
  const [isUnityUnresponsive, setIsUnityUnresponsive] = useState(false);
  const [failureMode, setFailureMode] = useState<UnityFailureMode>('quit');
  const { sendMessageToUnity, registerEventHandler, handleMessageFromUnity } =
    useRNUnityCommBridge({ rnUnityViewRef });
  const unityPaths = useRef<Array<string>>([]);

  const triggerFailureRef = useRef<() => void>(() => {});

  const { startHeartbeat, stopHeartbeat, isHeartbeatRunning } =
    useUnityHeartbeat({
      sendMessageToUnity,
      onFirstFailure: () => setIsUnityUnresponsive(true),
      onMaxFailuresReached: () => triggerFailureRef.current(),
    });

  const failureHandler: ReturnType<typeof useUnityFailureHandler> =
    useUnityFailureHandler({
      flowId,
      stopHeartbeat,
      onError: props.onError,
    });

  const {
    showErrorModal,
    triggerFailure,
    handleErrorModalDismiss,
    resetFailureState,
    suppressErrors,
  } = failureHandler;

  // Keep the ref in sync so the heartbeat callback always calls the latest version
  useEffect(() => {
    triggerFailureRef.current = triggerFailure;
  }, [triggerFailure]);

  logger.log(`[UnityView]: unityPaths: ${JSON.stringify(unityPaths.current)}`);

  const handleUnityReady = useCallback(async () => {
    try {
      await sendMessageToUnity({
        m_sId: uuidv4(),
        m_sKey: 'LoadConfigFile',
        m_sAdditionalInfo: props.payload.file ?? undefined,
      });
      setFailureMode('quit');
    } catch (err) {
      logger.error(`[UnityView] LoadConfigFile FAILED: ${err}`);
      triggerFailure();
    }
  }, [props.payload.file, logger, sendMessageToUnity, triggerFailure]);

  const handleRestartActivity = useCallback(() => {
    restartInProgressRef.current = true;
    stopHeartbeat();
    (resetFailureState as () => void)();
    setIsUnityUnresponsive(false);
    setFailureMode('quit');
    unityPaths.current = [];
    unityReadyHandled.current = false;

    // Step 1: fully remove RNUnityView from the tree
    setUnityViewKey(null);

    // Step 2: after a delay, remount with a fresh key so the native layer
    // has time to tear down before the new view triggers Unity to boot again.
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }
    restartTimerRef.current = setTimeout(() => {
      restartInProgressRef.current = false;
      setUnityViewKey(uuidv4());
    }, 1000);
  }, [resetFailureState, stopHeartbeat]);

  // Register Unity ready handler via the `UnityStarted` event.
  const handleUnityStarted =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      if (!unityReadyHandled.current) {
        unityReadyHandled.current = true;
        restartInProgressRef.current = false;
        setIsUnityUnresponsive(false);
        await handleUnityReady();
        startHeartbeat();
      }
    }, [handleUnityReady, startHeartbeat]);
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

  useEffect(() => {
    if (
      unityRuntimeState.quitInProcess &&
      !quitObservedInThisMountRef.current &&
      unityViewKey
    ) {
      logger.warn(
        '[UnityView] Unity runtime previously quit in this iOS process; not remounting native Unity and starting heartbeat probe while retry is evaluated',
      );
      setIsUnityUnresponsive(true);
      startHeartbeat();
    }
  }, [logger, startHeartbeat, unityViewKey]);

  // IMPORTANT: DO NOT use this effect for anything else!
  useEffect(() => {
    // (Re)generate a new react key for the RN Unity view so it gets
    // reinitialized when this container view is rendered for the first time.
    // This ensure we can consistently get a Unity startup message.
    setUnityViewKey(uuidv4());

    return () => {
      suppressErrors();
      stopHeartbeat();
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
    };
  }, [stopHeartbeat, suppressErrors]);

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
          onRestart={handleRestartActivity}
          canRestart={failureMode === 'unloaded'}
          isFlow={!!flowId}
          nextActivityName={props.nextActivityName}
        />
      </>
    );
  } else {
    if (!unityViewKey) {
      return (
        <UnityErrorModal
          visible={showErrorModal}
          onDismiss={handleErrorModalDismiss}
          onRestart={handleRestartActivity}
          canRestart={failureMode === 'unloaded'}
          isFlow={!!flowId}
          nextActivityName={props.nextActivityName}
        />
      );
    } else if (
      unityRuntimeState.quitInProcess &&
      !quitObservedInThisMountRef.current
    ) {
      return (
        <>
          <Spinner withOverlay isVisible={isUnityUnresponsive} />
          <UnityErrorModal
            visible={showErrorModal}
            onDismiss={handleErrorModalDismiss}
            onRestart={handleRestartActivity}
            canRestart={failureMode === 'unloaded'}
            isFlow={!!flowId}
            nextActivityName={props.nextActivityName}
          />
        </>
      );
    } else {
      return (
        <>
          <RNUnityView
            key={unityViewKey}
            ref={rnUnityViewRef}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ flex: 1 }}
            onPlayerUnload={() => {
              logger.log('[UnityView] Native player unload received');
              if (restartInProgressRef.current) {
                return;
              }
              setFailureMode('unloaded');
              setIsUnityUnresponsive(true);
              if (!isHeartbeatRunning()) {
                triggerFailure();
              }
            }}
            onPlayerQuit={() => {
              unityRuntimeState.quitInProcess = true;
              quitObservedInThisMountRef.current = true;
              setFailureMode('quit');
              logger.warn(
                '[UnityView] Native player quit received; showing spinner immediately and waiting for heartbeat failures before surfacing the alert',
              );
              setIsUnityUnresponsive(true);
            }}
            onUnityMessage={result => {
              handleMessageFromUnity(result.nativeEvent.message);
            }}
          />
          <Spinner withOverlay isVisible={isUnityUnresponsive} />
          <UnityErrorModal
            visible={showErrorModal}
            onDismiss={handleErrorModalDismiss}
            onRestart={handleRestartActivity}
            canRestart={failureMode === 'unloaded'}
            isFlow={!!flowId}
            nextActivityName={props.nextActivityName}
          />
        </>
      );
    }
  }
};

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import RNUnityView from '@azesmway/react-native-unity';
import * as mime from 'react-native-mime-types';
import RNOrientationDirector, {
  Orientation,
} from 'react-native-orientation-director';
import { v4 as uuidv4 } from 'uuid';

import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import {
  UnityFailureMode,
  UnityResult,
} from '@entities/unity/lib/types/unityType.ts';
import { MediaFile } from '@shared/ui/survey/MediaItems/types.ts';

import {
  useRNUnityCommBridge,
  RNUnityCommBridgeUnityEventHandler,
} from './useRNUnityCommBridge';
import { useUnityFailureHandler } from './useUnityFailureHandler';
import { useUnityHeartbeat } from './useUnityHeartbeat';
import {
  ANDROID_REMOUNT_HANDSHAKE_DELAY_MS,
  ANDROID_REMOUNT_RESET_DELAY_MS,
  CONFIG_LOAD_TIMEOUT_MS,
  END_RESET_ACK_TIMEOUT_MS,
  LOAD_CONFIG_RETRY_INTERVAL_MS,
  STARTUP_TIMEOUT_MS,
} from '../constants';
import {
  UnityEventDataExport,
  UnityEventEndUnity,
  UnityEventSetOrientation,
  UnityEventUnityStarted,
} from '../types/unityMessage';

// State that must survive across mounts of the Unity screen.
const unityRuntimeState = {
  quitInProcess: false,
  // True once the Android engine has booted; it stays alive for the rest of
  // the process and never sends UnityStarted again.
  engineAliveAndroid: false,
};

type UseUnityLifecycleOptions = {
  payloadFile: string | null | undefined;
  onResponse?: (response: UnityResult) => void;
  onError?: () => void;
};

export const useUnityLifecycle = (options: UseUnityLifecycleOptions) => {
  const { payloadFile, onResponse, onError } = options;

  const logger: ILogger = getDefaultLogger();
  const { flowId } = useContext(ActivityIdentityContext);

  const rnUnityViewRef = useRef<RNUnityView | null>(null);
  const quitObservedInThisMountRef = useRef<boolean>(false);
  const unityReadyHandled = useRef<boolean>(false);
  const restartInProgressRef = useRef<boolean>(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const configLoadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [unityViewKey, setUnityViewKey] = useState<string | null>(null);
  const [isUnityUnresponsive, setIsUnityUnresponsive] = useState(false);
  const [failureMode, setFailureMode] = useState<UnityFailureMode>('quit');
  const { sendMessageToUnity, registerEventHandler, handleMessageFromUnity } =
    useRNUnityCommBridge({ rnUnityViewRef });
  const unityPaths = useRef<Array<string>>([]);

  const triggerFailureRef = useRef<() => void>(() => {});

  const { startHeartbeat, stopHeartbeat } = useUnityHeartbeat({
    sendMessageToUnity,
    // Unity answered again, so hide the "unresponsive" overlay.
    onRecovered: () => setIsUnityUnresponsive(false),
    onMaxFailuresReached: () => triggerFailureRef.current(),
  });

  const failureHandler: ReturnType<typeof useUnityFailureHandler> =
    useUnityFailureHandler({
      flowId,
      stopHeartbeat,
      onError,
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

  // Token for the LoadConfigFile retry loop. Bumping it cancels any loop
  // that is still running.
  const loadConfigRunRef = useRef(0);

  // Send the task config to Unity and wait for it to be acknowledged.
  const handleUnityReady = useCallback(async () => {
    const runId = ++loadConfigRunRef.current;
    try {
      // On Android, Unity can silently drop a LoadConfigFile that arrives
      // while its scene is still reloading, so resend until acknowledged.
      // On iOS a single send is enough.
      const maxAttempts =
        Platform.OS === 'android'
          ? Math.max(
              1,
              Math.floor(
                CONFIG_LOAD_TIMEOUT_MS / LOAD_CONFIG_RETRY_INTERVAL_MS,
              ),
            )
          : 1;

      let acknowledged = false;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const sendPromise = sendMessageToUnity({
          m_sId: uuidv4(),
          m_sKey: 'LoadConfigFile',
          m_sAdditionalInfo: payloadFile ?? undefined,
        });

        const response =
          attempt === maxAttempts
            ? await sendPromise
            : await Promise.race([
                sendPromise,
                new Promise<'no-ack'>(resolve =>
                  setTimeout(
                    () => resolve('no-ack'),
                    LOAD_CONFIG_RETRY_INTERVAL_MS,
                  ),
                ),
              ]);

        if (loadConfigRunRef.current !== runId) {
          return;
        }

        if (response !== 'no-ack') {
          acknowledged = true;
          logger.log(
            `[UnityView] LoadConfigFile acknowledged (attempt ${attempt}/${maxAttempts})`,
          );
          break;
        }

        logger.warn(
          `[UnityView] LoadConfigFile not acknowledged within ${LOAD_CONFIG_RETRY_INTERVAL_MS}ms (attempt ${attempt}/${maxAttempts}) — retrying`,
        );
      }

      if (!acknowledged) {
        // The config load timeout will surface the failure.
        return;
      }

      if (configLoadTimerRef.current) {
        clearTimeout(configLoadTimerRef.current);
        configLoadTimerRef.current = null;
      }
      setFailureMode('quit');
    } catch (err) {
      logger.error(`[UnityView] LoadConfigFile FAILED: ${err}`);
      if (loadConfigRunRef.current === runId) {
        triggerFailure();
      }
    }
  }, [payloadFile, logger, sendMessageToUnity, triggerFailure]);

  // Tear down the Unity view and remount it fresh.
  const handleRestartActivity = useCallback(() => {
    logger.log('[UnityView] Restarting Unity activity');
    loadConfigRunRef.current++;
    restartInProgressRef.current = true;
    stopHeartbeat();
    (resetFailureState as () => void)();
    setIsUnityUnresponsive(false);
    setFailureMode('quit');
    unityPaths.current = [];
    unityReadyHandled.current = false;
    if (configLoadTimerRef.current) {
      clearTimeout(configLoadTimerRef.current);
      configLoadTimerRef.current = null;
    }

    // Remove RNUnityView from the tree.
    setUnityViewKey(null);

    // Remount with a fresh key after the native layer has had time to
    // tear down.
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }
    restartTimerRef.current = setTimeout(() => {
      restartInProgressRef.current = false;
      const newKey = uuidv4();
      logger.log(`[UnityView] Restart remount triggered (key=${newKey})`);
      setUnityViewKey(newKey);
    }, 1000);
  }, [logger, resetFailureState, stopHeartbeat]);

  // Start the app side of the startup handshake: heartbeat plus LoadConfigFile.
  const beginUnityHandshake = useCallback(async () => {
    if (!unityReadyHandled.current) {
      unityReadyHandled.current = true;
      restartInProgressRef.current = false;
      if (startupTimerRef.current) {
        clearTimeout(startupTimerRef.current);
        startupTimerRef.current = null;
      }
      setIsUnityUnresponsive(false);
      startHeartbeat();

      // Surface the error modal if the config does not load in time.
      configLoadTimerRef.current = setTimeout(() => {
        logger.warn(
          `[UnityView] Config did not load within ${CONFIG_LOAD_TIMEOUT_MS}ms — triggering failure`,
        );
        setFailureMode('quit');
        setIsUnityUnresponsive(true);
        triggerFailureRef.current();
      }, CONFIG_LOAD_TIMEOUT_MS);

      await handleUnityReady();
    }
  }, [handleUnityReady, logger, startHeartbeat]);

  // Keep refs in sync so timers always call the latest versions.
  const sendMessageToUnityRef = useRef(sendMessageToUnity);
  useEffect(() => {
    sendMessageToUnityRef.current = sendMessageToUnity;
  }, [sendMessageToUnity]);
  const beginUnityHandshakeRef = useRef(beginUnityHandshake);
  useEffect(() => {
    beginUnityHandshakeRef.current = beginUnityHandshake;
  }, [beginUnityHandshake]);

  // Start the handshake when Unity reports it has booted.
  const handleUnityStarted =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      if (Platform.OS === 'android') {
        // The engine stays alive for the rest of the process.
        unityRuntimeState.engineAliveAndroid = true;
      }
      await beginUnityHandshake();
    }, [beginUnityHandshake]);
  useEffect(() => {
    registerEventHandler(UnityEventUnityStarted, handleUnityStarted);
  }, [handleUnityStarted, registerEventHandler]);

  // Android remounts reuse the already-running engine, which may not send
  // UnityStarted again. Send Reset to reload the scene, then drive the
  // handshake ourselves once the reload has had time to finish.
  useEffect(() => {
    if (
      Platform.OS !== 'android' ||
      !unityViewKey ||
      !unityRuntimeState.engineAliveAndroid
    ) {
      return;
    }

    logger.log(
      '[UnityView] Android keep-alive remount: engine already running, sending Reset to reload the scene on-screen',
    );
    const resetTimer = setTimeout(() => {
      sendMessageToUnityRef
        .current({
          m_sId: uuidv4(),
          m_sKey: 'Reset',
        })
        .catch((err: unknown) => {
          logger.error(`[UnityView] Keep-alive remount Reset failed: ${err}`);
        });
    }, ANDROID_REMOUNT_RESET_DELAY_MS);

    const handshakeTimer = setTimeout(() => {
      logger.log(
        '[UnityView] Keep-alive remount: reload should be done, driving handshake',
      );
      beginUnityHandshakeRef.current().catch((err: unknown) => {
        logger.error(`[UnityView] Keep-alive handshake failed: ${err}`);
      });
    }, ANDROID_REMOUNT_RESET_DELAY_MS + ANDROID_REMOUNT_HANDSHAKE_DELAY_MS);

    return () => {
      clearTimeout(resetTimer);
      clearTimeout(handshakeTimer);
    };
  }, [logger, unityViewKey]);

  // The task is done: collect the exported files, reset Unity, and hand the
  // result back to the survey flow.
  const handleEndUnity =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      try {
        loadConfigRunRef.current++;
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

        const respond = () =>
          onResponse?.({
            responseType: 'unity',
            // TODO: Figure out what this should be
            startTime: 0,
            taskData: mediaFiles,
          });

        const sendReset = () =>
          sendMessageToUnity({
            m_sId: uuidv4(),
            m_sKey: 'Reset',
          });

        if (Platform.OS === 'android') {
          // Wait for Unity to acknowledge the Reset before unmounting, so the scene
          // reload finishes on-screen.
          const ack = await Promise.race([
            sendReset(),
            new Promise<'timeout'>(resolve =>
              setTimeout(() => resolve('timeout'), END_RESET_ACK_TIMEOUT_MS),
            ),
          ]);
          if (ack === 'timeout') {
            logger.warn(
              `[UnityView] End-of-task Reset not acknowledged within ${END_RESET_ACK_TIMEOUT_MS}ms — proceeding with unmount`,
            );
          } else {
            logger.log(
              '[UnityView] End-of-task Reset acknowledged — scene reloaded on-screen',
            );
          }
          respond();
        } else {
          respond();
          await sendReset();
        }
      } catch (err) {
        logger.error(`[UnityView] EndUnity handler failed: ${err}`);
      }
    }, [logger, onResponse, sendMessageToUnity, stopHeartbeat]);
  useEffect(() => {
    registerEventHandler(UnityEventEndUnity, handleEndUnity);
  }, [handleEndUnity, registerEventHandler]);

  // Collect the file paths Unity exports during the task.
  const handleDataExport = useCallback<RNUnityCommBridgeUnityEventHandler>(
    msg => {
      if (msg.m_sKey === UnityEventDataExport) {
        unityPaths.current = [...unityPaths.current, ...msg.m_listDataPaths];

        sendMessageToUnity({
          m_sId: uuidv4(),
          m_sKey: 'DataExportReceived',
          m_sAdditionalInfo: msg.m_sId,
        }).catch((err: unknown) => {
          logger.error(`[UnityView] DataExportReceived send failed: ${err}`);
        });
      }
    },
    [logger, sendMessageToUnity],
  );
  useEffect(() => {
    registerEventHandler(UnityEventDataExport, handleDataExport);
  }, [handleDataExport, registerEventHandler]);

  // Handle orientation change requests from Unity, re-lock to portrait on unmount.
  const handleSetOrientation = useCallback<RNUnityCommBridgeUnityEventHandler>(
    msg => {
      if (msg.m_sKey === UnityEventSetOrientation) {
        const orientationValue = msg.m_sAdditionalInfo;

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
    RNOrientationDirector.unlock();
    return () => {
      RNOrientationDirector.lockTo(Orientation.portrait);
    };
  }, [handleSetOrientation, registerEventHandler]);

  // If Unity already quit earlier in this process (iOS), do not trust the
  // remount and start probing with heartbeats instead.
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
    // Mount the Unity view with a fresh key so it fully reinitializes.
    const key = uuidv4();
    logger.log(`[UnityView] Mounting Unity view (key=${key})`);
    setUnityViewKey(key);

    // Surface the error modal if Unity does not start in time.
    startupTimerRef.current = setTimeout(() => {
      if (!unityReadyHandled.current) {
        logger.warn(
          `[UnityView] Unity did not start within ${STARTUP_TIMEOUT_MS}ms — triggering failure`,
        );
        setFailureMode('quit');
        setIsUnityUnresponsive(true);
        triggerFailure();
      }
    }, STARTUP_TIMEOUT_MS);

    return () => {
      logger.log('[UnityView] Unmounting Unity view');
      loadConfigRunRef.current++;
      suppressErrors();
      stopHeartbeat();
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
      if (startupTimerRef.current) {
        clearTimeout(startupTimerRef.current);
      }
      if (configLoadTimerRef.current) {
        clearTimeout(configLoadTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopHeartbeat, suppressErrors]);

  // The native player was unloaded, so the next mount needs a fresh boot.
  const handlePlayerUnload = useCallback(() => {
    logger.log('[UnityView] Native player unload received');
    unityRuntimeState.engineAliveAndroid = false;
    if (restartInProgressRef.current) {
      return;
    }
    setFailureMode('unloaded');
    setIsUnityUnresponsive(true);
  }, [logger]);

  // The native player quit entirely; show the spinner and let the heartbeat
  // decide whether to surface the error.
  const handlePlayerQuit = useCallback(() => {
    unityRuntimeState.quitInProcess = true;
    unityRuntimeState.engineAliveAndroid = false;
    quitObservedInThisMountRef.current = true;
    setFailureMode('quit');
    logger.warn(
      '[UnityView] Native player quit received; showing spinner immediately and waiting for heartbeat failures before surfacing the alert',
    );
    setIsUnityUnresponsive(true);
  }, [logger]);

  return {
    rnUnityViewRef,
    unityViewKey,
    isUnityUnresponsive,
    failureMode,
    flowId,
    showErrorModal,
    isQuitBeforeMount:
      unityRuntimeState.quitInProcess && !quitObservedInThisMountRef.current,
    handleErrorModalDismiss,
    handleRestartActivity,
    handleMessageFromUnity,
    handlePlayerUnload,
    handlePlayerQuit,
  };
};

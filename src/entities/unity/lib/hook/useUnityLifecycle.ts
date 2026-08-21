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

const unityRuntimeState = {
  quitInProcess: false,
  // Android keep-alive: Unity cannot be unloaded and re-created in the same
  // process (graphics re-init crashes), so the engine stays resident after the
  // first boot and never sends UnityStarted again. When this is true, a
  // (re)mounted Unity view must drive the handshake itself.
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
    onFirstFailure: () => setIsUnityUnresponsive(true),
    // A later Echo acked, so Unity is alive — hide the "unresponsive" overlay
    // shown by onFirstFailure. A single miss is often a false alarm: Unity's
    // main thread can be saturated by a task scene load long enough (>3s) to
    // delay the ack; without this the overlay stayed up forever and blocked
    // all touches ("stuck loading spinner").
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

  // Monotonic token for the LoadConfigFile retry loop. Bumping it cancels any
  // in-flight loop (unmount, restart, EndUnity, or a newer loop superseding an
  // older one) — each loop only keeps going while the token still matches the
  // value it started with.
  const loadConfigRunRef = useRef(0);

  const handleUnityReady = useCallback(async () => {
    const runId = ++loadConfigRunRef.current;
    try {
      // Android keep-alive: after Reset the Unity app reloads its scene, and
      // that reload can resume concurrently with this handshake — a
      // LoadConfigFile landing mid-reload is dropped by Unity (NRE in its
      // bridge) and never acknowledged, so resend until Unity responds. On iOS the
      // engine boots fresh and signals UnityStarted, so a single send
      // suffices (last attempt awaits the ack with no retry timeout, which
      // keeps iOS behavior identical to before).
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
          break;
        }

        logger.warn(
          `[UnityView] LoadConfigFile not acknowledged within ${LOAD_CONFIG_RETRY_INTERVAL_MS}ms (attempt ${attempt}/${maxAttempts}) — retrying`,
        );
      }

      if (!acknowledged) {
        // The config load timeout below will surface the failure.
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

    // Step 1: fully remove RNUnityView from the tree
    setUnityViewKey(null);

    // Step 2: after a delay, remount with a fresh key so the native layer
    // has time to tear down before the new view triggers Unity to boot again.
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

  // Run the app side of the startup handshake (heartbeat + LoadConfigFile).
  // Normally triggered by the `UnityStarted` event; on Android keep-alive
  // remounts the engine is already running and never sends UnityStarted, so
  // this is also driven manually from the remount effect below.
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

      // Start config load timeout — if handleUnityReady doesn't complete
      // within the deadline, surface the error modal.
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

  // Register Unity ready handler via the `UnityStarted` event.
  const handleUnityStarted =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      if (Platform.OS === 'android') {
        // The engine booted; it now stays resident for the life of the process
        // (see keep-alive notes on unityRuntimeState.engineAliveAndroid).
        unityRuntimeState.engineAliveAndroid = true;
      }
      await beginUnityHandshake();
    }, [beginUnityHandshake]);
  useEffect(() => {
    registerEventHandler(UnityEventUnityStarted, handleUnityStarted);
  }, [handleUnityStarted, registerEventHandler]);

  // Android keep-alive remounts: the resident engine parks off-screen between
  // mounts, and any scene reload interrupted by the unmount is permanently
  // stuck (the message pump still runs, but the reload never resumes — every
  // LoadConfigFile into that scene is dropped with an NRE). So instead of
  // handshaking with the stuck scene, send `Reset` to force a fresh reload
  // that runs entirely on-screen (the Unity app acks it "Loaded Successfully"
  // even from a stuck scene). The Unity app does NOT send `UnityStarted` after reloads
  // (fresh boot only), so once the reload has had time to finish we drive the
  // handshake (heartbeat + LoadConfigFile) ourselves. beginUnityHandshake is
  // a no-op if UnityStarted did arrive first, so the two paths cannot double
  // up. If everything is dropped, the startup timeout surfaces the failure.
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
          // Wait for Unity to ack the Reset ("Loaded Successfully") before
          // responding (which unmounts the view), so the scene reload runs
          // on-screen instead of hidden behind the Activities list.
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

  const handleDataExport = useCallback<RNUnityCommBridgeUnityEventHandler>(
    msg => {
      if (msg.m_sKey === UnityEventDataExport) {
        unityPaths.current = [...unityPaths.current, ...msg.m_listDataPaths];
      }
    },
    [logger],
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
    return () => {
      RNOrientationDirector.lockTo(Orientation.portrait);
    };
  }, [handleSetOrientation, registerEventHandler]);

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
    const key = uuidv4();
    logger.log(`[UnityView] Mounting Unity view (key=${key})`);
    setUnityViewKey(key);

    // Startup timeout: if UnityStarted is not received within the deadline,
    // assume Unity failed to boot and surface the error modal.
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

  const handlePlayerUnload = useCallback(() => {
    logger.log('[UnityView] Native player unload received');
    // The engine is gone — a future mount must wait for a fresh UnityStarted.
    unityRuntimeState.engineAliveAndroid = false;
    if (restartInProgressRef.current) {
      return;
    }
    setFailureMode('unloaded');
    setIsUnityUnresponsive(true);
  }, [logger]);

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

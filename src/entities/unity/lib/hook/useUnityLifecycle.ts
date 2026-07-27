import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import RNUnityView from '@azesmway/react-native-unity';
import * as mime from 'react-native-mime-types';
import RNOrientationDirector, {
  Orientation,
} from 'react-native-orientation-director';
import { v4 as uuidv4 } from 'uuid';

import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { wait } from '@app/shared/lib/utils/common';
import {
  UnityFailureMode,
  UnityResult,
} from '@entities/unity/lib/types/unityType.ts';
import { MediaFile } from '@shared/ui/survey/MediaItems/types.ts';

import {
  useRNUnityCommBridge,
  RNUnityCommBridgeUnityEventHandler,
  newEchoMessage,
} from './useRNUnityCommBridge';
import { useUnityFailureHandler } from './useUnityFailureHandler';
import { useUnityHeartbeat } from './useUnityHeartbeat';
import {
  ABANDONED_UNITY_RESET_TIMEOUT_MS,
  CONFIG_LOAD_TIMEOUT_MS,
  END_UNITY_RESET_TIMEOUT_MS,
  IDLE_PROBE_TIMEOUT_MS,
  STARTUP_TIMEOUT_MS,
} from '../constants';
import {
  UnityEventDataExport,
  UnityEventEndUnity,
  UnityEventSetOrientation,
  UnityEventUnityStarted,
} from '../types/unityMessage';

const unityRuntimeState = {
  startedInProcess: false, // Unity has started at some point during this app process
  quitInProcess: false, // Unity has quit at some point during this app process
  idleInLoadingScene: false, // Unity is confirmed to be running and idle in its loading scene
  configLoadCount: 0, // Bumped per config load and session invalidation, used to verify that Reset reply is not stale
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
  const endUnityHandledRef = useRef<boolean>(false);
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

  const handleUnityReady = useCallback(async () => {
    try {
      unityRuntimeState.configLoadCount += 1;
      unityRuntimeState.idleInLoadingScene = false;
      await sendMessageToUnity({
        m_sId: uuidv4(),
        m_sKey: 'LoadConfigFile',
        m_sAdditionalInfo: payloadFile ?? undefined,
      });
      if (configLoadTimerRef.current) {
        clearTimeout(configLoadTimerRef.current);
        configLoadTimerRef.current = null;
      }
      setFailureMode('quit');
    } catch (err) {
      logger.error(`[UnityView] LoadConfigFile FAILED: ${err}`);
      triggerFailure();
    }
  }, [payloadFile, logger, sendMessageToUnity, triggerFailure]);

  const handleRestartActivity = useCallback(() => {
    logger.log('[UnityView] Restarting Unity activity');
    restartInProgressRef.current = true;
    unityRuntimeState.configLoadCount += 1;
    unityRuntimeState.idleInLoadingScene = false;
    stopHeartbeat();
    (resetFailureState as () => void)();
    setIsUnityUnresponsive(false);
    setFailureMode('quit');
    unityPaths.current = [];
    unityReadyHandled.current = false;
    endUnityHandledRef.current = false;
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

  // Register Unity ready handler via the `UnityStarted` event.
  const handleUnityStarted =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      if (!unityReadyHandled.current) {
        unityReadyHandled.current = true;
        unityRuntimeState.startedInProcess = true;
        restartInProgressRef.current = false;
        if (startupTimerRef.current) {
          clearTimeout(startupTimerRef.current);
          startupTimerRef.current = null;
        }
        setIsUnityUnresponsive(false);
        startHeartbeat();

        // Start config load timeout -- if handleUnityReady doesn't complete
        // within the deadline, surface the error modal.
        configLoadTimerRef.current = setTimeout(() => {
          logger.warn(
            `[UnityView] Config did not load within ${CONFIG_LOAD_TIMEOUT_MS}ms -- triggering failure`,
          );
          setFailureMode('quit');
          setIsUnityUnresponsive(true);
          triggerFailureRef.current();
        }, CONFIG_LOAD_TIMEOUT_MS);

        await handleUnityReady();
      }
    }, [handleUnityReady, logger, startHeartbeat]);
  useEffect(() => {
    registerEventHandler(UnityEventUnityStarted, handleUnityStarted);
  }, [handleUnityStarted, registerEventHandler]);

  // Keep the latest handler in a ref so the configure effect below does not
  // re-run (cancelling an in-flight probe) whenever this identity changes.
  const handleUnityStartedRef = useRef<RNUnityCommBridgeUnityEventHandler>(
    () => {},
  );
  useEffect(() => {
    handleUnityStartedRef.current = handleUnityStarted;
  }, [handleUnityStarted]);

  // Send Reset and wait for Unity's "Loaded Successfully" confirmation
  const sendResetAndConfirm = useCallback(
    async (timeoutMs: number): Promise<boolean> => {
      const configLoadCountAtReset = unityRuntimeState.configLoadCount;
      const resetPromise = sendMessageToUnity({
        m_sId: uuidv4(),
        m_sKey: 'Reset',
      });

      resetPromise
        .then(reply => {
          if (
            reply?.m_sAdditionalInfo === 'Loaded Successfully' &&
            unityRuntimeState.configLoadCount === configLoadCountAtReset
          ) {
            unityRuntimeState.idleInLoadingScene = true;
          }
        })
        .catch(() => {});

      const reply = await Promise.race([
        resetPromise,
        wait(timeoutMs).then(() => null),
      ]);
      const confirmed = reply?.m_sAdditionalInfo === 'Loaded Successfully';
      if (!confirmed) {
        logger.warn(
          `[UnityView] Reset not confirmed within ${timeoutMs}ms (reply: ${JSON.stringify(reply)})`,
        );
      }
      return confirmed;
    },
    [logger, sendMessageToUnity],
  );

  // Unity only sends UnityStarted on its first boot in the app process (M2-10980)
  // - If Unity is already running, probe with Echo and wait for reply
  // - If Unity is booting fresh, probe stays unanswered and we wait for normal UnityStarted
  // - If probe is answered, Reset any abandoned previous session and proceed to configure new session
  useEffect(() => {
    if (
      !unityViewKey ||
      !unityRuntimeState.startedInProcess ||
      unityRuntimeState.quitInProcess ||
      unityReadyHandled.current
    ) {
      return;
    }

    let cancelled = false;

    const configureRunningUnity = async () => {
      logger.log('[UnityView] Check if Unity is idling; probing with Echo');
      const reply = await Promise.race([
        sendMessageToUnity(newEchoMessage('idle-probe')),
        wait(IDLE_PROBE_TIMEOUT_MS).then(() => null),
      ]);

      if (cancelled || unityReadyHandled.current) {
        return; // Stop if this mount is cancelled or normal UnityStarted is handled
      }

      if (reply) {
        logger.log('[UnityView] Unity responded to Echo probe');
      } else {
        logger.warn(
          '[UnityView] No probe response from Unity; waiting for UnityStarted',
        );
        return;
      }

      if (!unityRuntimeState.idleInLoadingScene) {
        logger.log(
          '[UnityView] Previous Unity session is not idle; send Reset before proceeding with new session',
        );
        // Reset abandoned Unity session before configuring the new session
        const resetConfirmed = await sendResetAndConfirm(
          ABANDONED_UNITY_RESET_TIMEOUT_MS,
        );
        if (cancelled || unityReadyHandled.current) {
          return; // Stop if this mount is cancelled or normal UnityStarted is handled (recheck after await)
        }
        if (!resetConfirmed) {
          return; // Stop if abandoned Unity session has not been reset
        }
      }

      logger.log(
        '[UnityView] Ready to configure new Unity session; skipping UnityStarted wait',
      );
      handleUnityStartedRef.current({
        m_sId: '',
        m_sKey: UnityEventUnityStarted,
      });
    };

    configureRunningUnity().catch(err => {
      logger.warn(`[UnityView] Failed to configure running Unity: ${err}`);
    });

    return () => {
      cancelled = true;
    };
  }, [logger, sendMessageToUnity, sendResetAndConfirm, unityViewKey]);

  const handleEndUnity =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      if (endUnityHandledRef.current) {
        logger.warn('[UnityView] Duplicate EndUnity event ignored');
        return;
      }
      endUnityHandledRef.current = true;
      try {
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

        // Reset Unity and wait for "Loaded Successfully" reply before advancing --
        // advancing first would unmount this view and freeze Unity mid-reset (M2-10980)
        try {
          await sendResetAndConfirm(END_UNITY_RESET_TIMEOUT_MS);
        } catch (err) {
          logger.warn(
            `[UnityView] Sending Reset to Unity failed: ${err}; advancing anyway`,
          );
        }

        onResponse?.({
          responseType: 'unity',
          // TODO: Figure out what this should be
          startTime: 0,
          taskData: mediaFiles,
        });
      } catch (err) {
        logger.error(`[UnityView] EndUnity handler failed: ${err}`);
        endUnityHandledRef.current = false;
      }
    }, [logger, onResponse, sendResetAndConfirm, stopHeartbeat]);
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
          `[UnityView] Unity did not start within ${STARTUP_TIMEOUT_MS}ms -- triggering failure`,
        );
        setFailureMode('quit');
        setIsUnityUnresponsive(true);
        triggerFailure();
      }
    }, STARTUP_TIMEOUT_MS);

    return () => {
      logger.log('[UnityView] Unmounting Unity view');
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
    unityRuntimeState.configLoadCount += 1;
    unityRuntimeState.idleInLoadingScene = false;
    if (restartInProgressRef.current) {
      return;
    }
    setFailureMode('unloaded');
    setIsUnityUnresponsive(true);
  }, [logger]);

  const handlePlayerQuit = useCallback(() => {
    unityRuntimeState.quitInProcess = true;
    unityRuntimeState.configLoadCount += 1;
    unityRuntimeState.idleInLoadingScene = false;
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

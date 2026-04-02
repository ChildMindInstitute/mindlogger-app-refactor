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
import { CONFIG_LOAD_TIMEOUT_MS, STARTUP_TIMEOUT_MS } from '../constants';
import {
  UnityEventEndUnity,
  UnityEventSetOrientation,
  UnityEventUnityStarted,
} from '../types/unityMessage';

const unityRuntimeState = {
  quitInProcess: false,
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

  // Register Unity ready handler via the `UnityStarted` event.
  const handleUnityStarted =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
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
  useEffect(() => {
    registerEventHandler(UnityEventUnityStarted, handleUnityStarted);
  }, [handleUnityStarted, registerEventHandler]);

  const handleEndUnity =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      try {
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

        onResponse?.({
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
      } catch (err) {
        logger.error(`[UnityView] EndUnity handler failed: ${err}`);
      }
    }, [logger, onResponse, sendMessageToUnity, stopHeartbeat]);
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
    if (restartInProgressRef.current) {
      return;
    }
    setFailureMode('unloaded');
    setIsUnityUnresponsive(true);
  }, [logger]);

  const handlePlayerQuit = useCallback(() => {
    unityRuntimeState.quitInProcess = true;
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

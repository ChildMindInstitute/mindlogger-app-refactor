import { FC, useLayoutEffect } from 'react';
import { UIManager } from 'react-native';

import RNUnityView from '@azesmway/react-native-unity';

import { bannerActions } from '@app/entities/banner/model/slice';
import { UnityPipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { Spinner } from '@app/shared/ui/Spinner';
import { Text } from '@app/shared/ui/Text';
import { UnityResult } from '@entities/unity/lib/types/unityType.ts';

import { UnityErrorModal } from './UnityErrorModal';
import { useUnityLifecycle } from '../lib/hook/useUnityLifecycle';

type Props = {
  payload: UnityPipelineItem['payload'];
  onResponse?: (response: UnityResult) => void;
  onError?: () => void;
  nextActivityName?: string;
};

export const UnityView: FC<Props> = props => {
  const compiledWithRNUnityView = !!(
    UIManager as never as Record<string, unknown>
  ).RNUnityView;

  const {
    rnUnityViewRef,
    unityViewKey,
    isUnityUnresponsive,
    isStaleFrameCovered,
    failureMode,
    flowId,
    showErrorModal,
    isQuitBeforeMount,
    handleErrorModalDismiss,
    handleRestartActivity,
    handleMessageFromUnity,
    handlePlayerUnload,
    handlePlayerQuit,
  } = useUnityLifecycle({
    payloadFile: props.payload.file,
    onResponse: props.onResponse,
    onError: props.onError,
  });

  // Opaque, so a previous task's last frame can't show through (M2-11244).
  const staleFrameCover = (
    <Spinner
      withOverlay
      isVisible={isStaleFrameCovered}
      overlayColor={palette.surface}
    />
  );

  const errorModal = (
    <UnityErrorModal
      visible={showErrorModal}
      onDismiss={handleErrorModalDismiss}
      onRestart={handleRestartActivity}
      canRestart={failureMode === 'unloaded'}
      isFlow={!!flowId}
      nextActivityName={props.nextActivityName}
    />
  );

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(bannerActions.setBannersHidden(true));
    return () => {
      dispatch(bannerActions.setBannersHidden(false));
    };
  }, [dispatch]);

  if (!compiledWithRNUnityView) {
    // TODO: Render some dummy/placeholder UI to bypass the activity
    return (
      <>
        <Text fontSize={16} lineHeight={24}>
          RNUnityView missing from compiled binary!
        </Text>
        {errorModal}
      </>
    );
  }

  if (!unityViewKey) {
    // No Unity view yet: first render, restarting, or waiting to attach to the
    // kept-alive engine (M2-11244).
    return (
      <>
        {staleFrameCover}
        {errorModal}
      </>
    );
  }

  if (isQuitBeforeMount) {
    return (
      <>
        <Spinner withOverlay isVisible={isUnityUnresponsive} />
        {errorModal}
      </>
    );
  }

  return (
    <>
      <RNUnityView
        key={unityViewKey}
        testID="merit-unity-view"
        ref={rnUnityViewRef}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}
        onPlayerUnload={handlePlayerUnload}
        onPlayerQuit={handlePlayerQuit}
        onUnityMessage={result => {
          handleMessageFromUnity(result.nativeEvent.message);
        }}
      />
      {staleFrameCover}
      <Spinner withOverlay isVisible={isUnityUnresponsive} />
      {errorModal}
    </>
  );
};

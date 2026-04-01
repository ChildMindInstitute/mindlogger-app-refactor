import { FC } from 'react';
import { UIManager } from 'react-native';

import RNUnityView from '@azesmway/react-native-unity';

import { UnityPipelineItem } from '@app/features/pass-survey/lib/types/payload';
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
    return errorModal;
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
        ref={rnUnityViewRef}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}
        onPlayerUnload={handlePlayerUnload}
        onPlayerQuit={handlePlayerQuit}
        onUnityMessage={result => {
          handleMessageFromUnity(result.nativeEvent.message);
        }}
      />
      <Spinner withOverlay isVisible={isUnityUnresponsive} />
      {errorModal}
    </>
  );
};

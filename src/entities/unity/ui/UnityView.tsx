import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { UIManager } from 'react-native';

import RNUnityView from '@azesmway/react-native-unity';
import { v4 as uuidv4 } from 'uuid';

import { UnityPipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { Text } from '@app/shared/ui/Text';

import {
  useRNUnityCommBridge,
  RNUnityCommBridgeUnityEventHandler,
} from '../lib/hook/useRNUnityCommBridge';
import { UnityEventUnityStarted } from '../lib/types/unityMessage';

type Props = {
  payload: UnityPipelineItem['payload'];
};

export const UnityView: FC<Props> = props => {
  const compiledWithRNUnityView = !!(
    UIManager as never as Record<string, unknown>
  ).RNUnityView;

  const rnUnityViewRef = useRef<RNUnityView | null>(null);
  const [unityViewKey, setUnityViewKey] = useState<string | null>(null);
  const { sendMessageToUnity, registerEventHandler, handleMessageFromUnity } =
    useRNUnityCommBridge({ rnUnityViewRef });

  const handleUnityStarted =
    useCallback<RNUnityCommBridgeUnityEventHandler>(async () => {
      console.log(
        '!!! TODO: Load activity config:',
        JSON.stringify(props.payload.file),
      );

      const echoResponse = await sendMessageToUnity({
        m_sId: 'abc-123',
        m_sKey: 'Echo',
        m_sAdditionalInfo: JSON.stringify({
          test: 'this',
          and: { that: 42 },
        }),
      });
      console.log('!!! echoResponse:', JSON.stringify(echoResponse));
    }, [props.payload.file, sendMessageToUnity]);

  useEffect(() => {
    // (Re)generate a new react key for the RN Unity view so it gets
    // reinitialized when this container view is rendered for the first time.
    // This ensure we can consistently get a Unity startup message.
    setUnityViewKey(uuidv4());

    registerEventHandler(UnityEventUnityStarted, handleUnityStarted);
  }, [handleUnityStarted, registerEventHandler]);

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
          ref={rnUnityViewRef}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ flex: 1 }}
          onUnityMessage={result =>
            handleMessageFromUnity(result.nativeEvent.message)
          }
        />
      );
    }
  }
};

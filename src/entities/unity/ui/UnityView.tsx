import { FC, useCallback, useEffect, useRef, useState } from 'react';

import RNUnityView from '@azesmway/react-native-unity';
import { v4 as uuidv4 } from 'uuid';

import { UnityPipelineItem } from '@app/features/pass-survey/lib/types/payload';

type Props = {
  payload: UnityPipelineItem['payload'];
};

type MessageFromUnity = {
  m_sId: string;
  m_sKey: string;
  [key: string]: unknown;
};

export const UnityView: FC<Props> = props => {
  const unityRef = useRef<RNUnityView>(null);
  const [unityViewKey, setUnityViewKey] = useState<string | null>(null);

  useEffect(() => {
    // (Re)generate a new react key for the RN Unity view so it gets
    // reinitialized when this container view is rendered for the first time.
    // This ensure we can consistently get a Unity startup message.
    setUnityViewKey(uuidv4());
  }, []);

  const handleUnityStarted = useCallback(() => {
    console.log('!!! handleUnityStarted');
    console.log(
      '!!! TODO: Load activity config:',
      JSON.stringify(props.payload.file),
    );
  }, [props.payload.file]);

  const handleUnityMessage = useCallback(
    (messageString: string) => {
      console.log('!!! handleUnityMessage:', messageString);

      // TODO: Deprecate this message. In general, all messages from Unity
      //       should be in JSON format.
      if (messageString === 'Unity Has Started') {
        handleUnityStarted();
        return;
      }

      let message: MessageFromUnity | null;
      try {
        message = JSON.parse(messageString) as MessageFromUnity;
      } catch (err) {
        console.error(`Error parsing message from Unity:`, err);
        message = null;
      }
      if (message) {
        console.log('!!! parsed Unity message:', JSON.stringify(message));

        if (message.m_sKey === 'UnityStarted') {
          handleUnityStarted();
        }
      }
    },
    [handleUnityStarted],
  );

  if (!unityViewKey) {
    return null;
  } else {
    return (
      <RNUnityView
        ref={unityRef}
        style={{ flex: 1 }}
        onUnityMessage={result =>
          handleUnityMessage(result.nativeEvent.message)
        }
      />
    );
  }
};

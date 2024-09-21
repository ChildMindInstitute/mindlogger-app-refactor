import { FC, useEffect, useRef } from 'react';

import UnityView from '@azesmway/react-native-unity';

import { UnityProps } from './types';

interface IMessage {
  gameObject: string;
  methodName: string;
  message: string;
}

const Unity: FC<UnityProps> = ({ title, config }) => {
  const unityRef = useRef<UnityView>(null);

  useEffect(() => {
    if (unityRef.current) {
      const message: IMessage = {
        gameObject: 'gameObject',
        methodName: 'methodName',
        message: 'message',
      };
      unityRef.current.postMessage(
        message.gameObject,
        message.methodName,
        message.message,
      );
    }
  }, []);

  return (
    <UnityView
      ref={unityRef}
      style={{ flex: 1 }}
      onUnityMessage={(result: any) => {
        console.log('onUnityMessage', result?.nativeEvent.message);
      }}
    />
  );
};

export default Unity;

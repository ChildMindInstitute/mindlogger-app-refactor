import { FC, useEffect, useRef } from 'react';

import UnityView from '@azesmway/react-native-unity';

import { useBanner } from '@app/shared/lib';

import { UnityProps } from './types';

interface IMessage {
  gameObject: string;
  methodName: string;
  message: string;
}

const Unity: FC<UnityProps> = ({ title, config }) => {
  const unityRef = useRef<UnityView>(null);
  const banner = useBanner();

  useEffect(() => {
    if (unityRef.current) {
      const message: IMessage = {
        gameObject: 'BodyTxt - TestRecievingMessageReactLong',
        methodName: 'DisplayReactMessage',
        message: title || 'Hello World!',
      };
      setTimeout(() => {
        unityRef.current?.postMessage(
          message.gameObject,
          message.methodName,
          message.message,
        );
      }, 500);
      unityRef.current?.postMessage(
        'BodyTxt_React',
        message.methodName,
        'Hello World',
      );
    }
  }, []);

  return (
    <UnityView
      ref={unityRef}
      style={{ flex: 1 }}
      onUnityMessage={(result: any) => {
        banner.show(result?.nativeEvent.message, {
          type: 'success',
          visibilityTime: 5000,
        });
      }}
    />
  );
};

export default Unity;

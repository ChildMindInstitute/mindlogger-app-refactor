type TimeoutId = ReturnType<typeof setTimeout>;

type IntervalId = ReturnType<typeof setInterval>;

type Maybe<TValue> = TValue | null | undefined;

declare module 'crypto-browserify';

declare module '@azesmway/react-native-unity' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  import { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

  type UnityViewContentUpdateEvent = Readonly<{ message: string }>;

  export interface UnityViewProps extends ViewProps {
    onUnityMessage?: DirectEventHandler<UnityViewContentUpdateEvent>;
  }

  export default class UnityView extends Component<UnityViewProps> {
    postMessage(gameObject: string, methodName: string, message: string): void;
    unloadUnity(): void;
    pauseUnity(pause: boolean): void;
    resumeUnity(): void;
    windowFocusChanged(hasFocus: boolean): void;
  }
}

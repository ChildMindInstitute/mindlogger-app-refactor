type TimeoutId = ReturnType<typeof setTimeout>;

type IntervalId = ReturnType<typeof setInterval>;

type Maybe<TValue> = TValue | null | undefined;

declare module '@azesmway/react-native-unity' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface UnityViewProps extends ViewProps {
    onUnityMessage?: (message: any) => void;
  }

  export default class UnityView extends Component<UnityViewProps> {
    postMessage(gameObject: string, methodName: string, message: string): void;
    pause(): void;
    resume(): void;
  }
}

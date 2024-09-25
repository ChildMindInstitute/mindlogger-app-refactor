import { useRef } from 'react';

type AnyFunc = (...args: any[]) => void;
type Callbacks = Record<string, AnyFunc>;

export function useCallbacksRefs<TCallbacks extends Callbacks>(
  callbacks: TCallbacks,
) {
  const callbacksRef = useRef(callbacks);

  callbacksRef.current = callbacks;

  return callbacksRef;
}

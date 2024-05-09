import { useRef } from 'react';

type AnyFunc = (...args: any[]) => void;
type Callbacks = Record<string, AnyFunc>;

function useCallbacksRefs<TCallbacks extends Callbacks>(callbacks: TCallbacks) {
  const callbacksRef = useRef(callbacks);

  callbacksRef.current = callbacks;

  return callbacksRef;
}

export default useCallbacksRefs;

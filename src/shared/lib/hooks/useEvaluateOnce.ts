import { useRef } from 'react';

function useEvaluateOnce<TEvaluateFunc extends () => unknown>(
  evaluate: TEvaluateFunc,
) {
  const isEvaluatedRef = useRef(false);

  const valueRef = useRef<ReturnType<TEvaluateFunc>>(null);

  if (!isEvaluatedRef.current) {
    // @ts-ignore
    valueRef.current = evaluate();
    isEvaluatedRef.current = true;
  }

  return valueRef.current as ReturnType<TEvaluateFunc>;
}

export default useEvaluateOnce;

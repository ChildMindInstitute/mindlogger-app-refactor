import { useEffect, useRef } from 'react';

export function usePreviousRenderedValue<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

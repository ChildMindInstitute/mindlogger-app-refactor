import { useCallback, useState } from 'react';

const MaxValue = 1000;

const useForceUpdate = () => {
  const [, setValue] = useState<number>(0);

  const forceRender = useCallback(() => {
    setValue((x) => (x === MaxValue ? 0 : x + 1));
  }, []);

  return forceRender;
};

export default useForceUpdate;

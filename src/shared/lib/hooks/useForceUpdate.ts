import { useCallback, useState } from 'react';

const useForceUpdate = () => {
  const [, setFlag] = useState(false);

  const forceRender = useCallback(() => {
    setFlag(x => !x);
  }, []);

  return forceRender;
};

export default useForceUpdate;

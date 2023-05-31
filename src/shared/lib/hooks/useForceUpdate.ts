import { useState } from 'react';

const useForceUpdate = () => {
  const [, setFlag] = useState(false);

  const forceRender = () => {
    setFlag(x => !x);
  };

  return forceRender;
};

export default useForceUpdate;

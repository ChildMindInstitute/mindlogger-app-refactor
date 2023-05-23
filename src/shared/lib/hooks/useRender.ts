import { useState } from 'react';

const useRender = () => {
  const [, setFlag] = useState(false);

  const reRender = () => {
    setFlag(x => !x);
  };

  return reRender;
};

export default useRender;

import { useEffect, useState } from 'react';

const FreezeTimeout = 300;

const useSketchCanvasTimedVisibility = () => {
  const [isSketchCanvasShown, setIsSketchCanvasShown] = useState(true);

  useEffect(() => {
    if (isSketchCanvasShown) {
      return;
    }

    const id = setTimeout(() => {
      setIsSketchCanvasShown(true);
    }, FreezeTimeout);

    return () => {
      clearTimeout(id);
    };
  }, [isSketchCanvasShown]);

  const hideSketchCanvas = () => setIsSketchCanvasShown(false);

  return {
    isSketchCanvasShown,
    hideSketchCanvas,
  };
};

export default useSketchCanvasTimedVisibility;

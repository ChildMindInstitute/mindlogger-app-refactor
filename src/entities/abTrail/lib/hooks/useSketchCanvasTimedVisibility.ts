import { useEffect, useState } from 'react';

const FreezeTimeout = 50;

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

  const showSketchCanvas = () => setIsSketchCanvasShown(true);

  return {
    isSketchCanvasShown,
    hideSketchCanvas,
    showSketchCanvas,
  };
};

export default useSketchCanvasTimedVisibility;

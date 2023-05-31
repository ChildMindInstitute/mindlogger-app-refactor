import { useRef } from 'react';

type Result = {
  shouldRestore: () => boolean;
  updateShouldRestore: () => void;
};

const NumberOrRedrawsAfterRender = 5;

/*
SkiaView looses it's state after render, and makes it asynchronously,
so we need these helpers to to restore it
*/
const useShouldRestoreSkiaViewState = (): Result => {
  const redrawAfterRenderRef = useRef(0);

  redrawAfterRenderRef.current = NumberOrRedrawsAfterRender;

  const shouldRestore = () => redrawAfterRenderRef.current > 0;

  const updateShouldRestore = () =>
    (redrawAfterRenderRef.current = redrawAfterRenderRef.current - 1);

  return {
    shouldRestore,
    updateShouldRestore,
  };
};

export default useShouldRestoreSkiaViewState;

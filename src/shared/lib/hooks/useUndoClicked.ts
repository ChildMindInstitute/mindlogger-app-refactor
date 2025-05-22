import { useRef } from 'react';

import { useForceUpdate } from './useForceUpdate';
import { usePreviousRenderedValue } from './usePreviousRenderedValue';

type Result = {
  undoClicked: () => boolean;
  resetUndoClicked: () => void;
};

export const useUndoClicked = (isCurrentValueEmpty: boolean): Result => {
  const isPreviousValueEmpty = usePreviousRenderedValue(isCurrentValueEmpty);

  const undoClickedRef = useRef(false);

  const reRender = useForceUpdate();

  undoClickedRef.current =
    isCurrentValueEmpty && isPreviousValueEmpty === false;

  const undoClicked = () => undoClickedRef.current;

  return {
    undoClicked,
    resetUndoClicked: reRender,
  };
};

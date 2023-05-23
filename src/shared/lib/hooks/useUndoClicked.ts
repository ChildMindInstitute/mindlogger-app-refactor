import { useRef } from 'react';

import usePrevious from './usePrevious';
import useRender from './useRender';

type Result = {
  undoClicked: () => boolean;
  resetUndoClicked: () => void;
};

const useUndoClicked = (isCurrentValueEmpty: boolean): Result => {
  const isPreviousValueEmpty = usePrevious(isCurrentValueEmpty);

  const undoClickedRef = useRef(false);

  const reRender = useRender();

  undoClickedRef.current =
    isCurrentValueEmpty && isPreviousValueEmpty === false;

  const undoClicked = () => undoClickedRef.current;

  return {
    undoClicked,
    resetUndoClicked: reRender,
  };
};

export default useUndoClicked;

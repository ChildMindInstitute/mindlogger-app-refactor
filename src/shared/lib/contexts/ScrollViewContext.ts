import { createContext } from 'react';

type ScrollViewContext = {
  scrollToEnd: () => void;
  isAreaScrollable: boolean;
  setScrollEnabled: (value: boolean) => void;
};

const ScrollViewContext = createContext({} as ScrollViewContext);

export default ScrollViewContext;

import { createContext } from 'react';

type ScrollViewContext = {
  scrollToEnd: () => void;
  isAreaScrollable: boolean;
  setScrollEnabled: (value: boolean) => void;
};

export const ScrollViewContext = createContext({} as ScrollViewContext);

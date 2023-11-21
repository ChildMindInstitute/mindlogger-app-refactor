import { createContext } from 'react';

type ActivityScroll = {
  scrollToEnd: () => void;
  isAreaScrollable: boolean;
  setScrollEnabled: (value: boolean) => void;
};

const ActivityScrollContext = createContext({} as ActivityScroll);

export default ActivityScrollContext;

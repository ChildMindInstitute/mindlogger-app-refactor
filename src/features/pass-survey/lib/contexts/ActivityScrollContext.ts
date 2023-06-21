import { createContext } from 'react';

type ActivityScroll = {
  scrollToEnd: () => void;
  isAreaScrollable: boolean;
};

const ActivityScrollContext = createContext({} as ActivityScroll);

export default ActivityScrollContext;

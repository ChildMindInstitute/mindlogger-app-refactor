import { createContext } from 'react';

type ActivityScroll = {
  scrollToEnd: () => void;
};

const ActivityScrollContext = createContext({} as ActivityScroll);

export default ActivityScrollContext;

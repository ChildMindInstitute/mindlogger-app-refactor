import { createContext, useContext } from 'react';

type TimeIsUpListener = () => void;

type ActivityTimer = {
  // Subscribe to the activity's time running out, from either its schedule
  // window or its own time limit. Returns a function that unsubscribes.
  onTimeIsUp: (listener: TimeIsUpListener) => () => void;
};

// Scoped to one activity, unlike the global Emitter. Defaults to a no-op so
// anything rendered outside an activity doesn't need a provider.
export const ActivityTimerContext = createContext<ActivityTimer>({
  onTimeIsUp: () => () => {},
});

export const useActivityTimer = () => useContext(ActivityTimerContext);

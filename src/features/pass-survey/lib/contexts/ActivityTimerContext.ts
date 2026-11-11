import { createContext, useContext } from 'react';

type TimeIsUpListener = () => void;

type ActivityTimer = {
  // Subscribe to the activity's time running out, from either its schedule
  // window or its own time limit. Returns a function that unsubscribes.
  onTimeIsUp: (listener: TimeIsUpListener) => () => void;
  // Set while a screen is still saving its work after time is up, so the
  // activity waits before submitting.
  setWaiting: (isWaiting: boolean) => void;
};

// Scoped to one activity, unlike the global Emitter. Defaults to a no-op so
// anything rendered outside an activity doesn't need a provider.
export const ActivityTimerContext = createContext<ActivityTimer>({
  onTimeIsUp: () => () => {},
  setWaiting: () => {},
});

export const useActivityTimer = () => useContext(ActivityTimerContext);

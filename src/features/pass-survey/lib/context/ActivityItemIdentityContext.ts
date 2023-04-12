import { createContext } from 'react';

type ActivityItemIdentifiers = {
  appletId: string;
  activityId: string;
  eventId: string;
};

const ActivityItemIdentityContext = createContext(
  {} as ActivityItemIdentifiers,
);

export default ActivityItemIdentityContext;

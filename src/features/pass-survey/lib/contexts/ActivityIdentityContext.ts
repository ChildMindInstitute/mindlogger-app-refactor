import { createContext } from 'react';

type ActivityIdentifiers = {
  appletId: string;
  activityId: string;
  eventId: string;
};

const ActivityIdentityContext = createContext({} as ActivityIdentifiers);

export default ActivityIdentityContext;

import { createContext } from 'react';

type ActivityIdentifiers = {
  appletId: string;
  activityId: string;
  eventId: string;
  order: number;
  activityName: string;
  flowId?: string;
  targetSubjectId: string | null;
};

export const ActivityIdentityContext = createContext({} as ActivityIdentifiers);

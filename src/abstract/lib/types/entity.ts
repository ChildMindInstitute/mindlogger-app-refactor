import { QueryClient } from '@tanstack/react-query';

import { IdName } from './primitive';

export type EntityType = 'flow' | 'regular';

export type EntityPath = {
  appletId: string;
  eventId: string;
  entityId: string;
  entityType: EntityType;
};

export type LookupEntityInput = {
  appletId: string;
  entityId: string;
  entityType: EntityType;
  queryClient: QueryClient;
};

export type FlowProgressActivity = IdName & {
  description: string;
  image: string | null;
};

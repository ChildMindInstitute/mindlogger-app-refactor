import { QueryClient } from '@tanstack/react-query';

import { IdName } from './primitive';

export type EntityType = 'flow' | 'regular';

export type EntityPathParams = {
  appletId: string;
  eventId: string;
  entityId: string;
};

export type EntityPath = EntityPathParams & {
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

export type CompleteEntityIntoUploadToQueue = (
  entityPath: EntityPath,
) => Promise<void>;

export type ProcessAutocompletion = (
  exclude?: EntityPathParams,
  forceRefreshNotifications?: boolean,
) => Promise<boolean>;

export type CheckAvailability = (
  entityName: string,
  identifiers: EntityPath,
) => Promise<boolean>;

export type EvaluateAvailableTo = (
  appletId: string,
  eventId: string,
) => Date | null;

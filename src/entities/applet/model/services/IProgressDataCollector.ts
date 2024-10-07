import { AxiosResponse } from 'axios';

import {
  CompletedEntitiesResponse,
  EntitiesCompletionsDto,
} from '@shared/api/services/IEventsService';

type AppletId = string;

export type CollectForAppletResult = AxiosResponse<
  CompletedEntitiesResponse,
  any
> | null;

export type CollectRemoteCompletionsResult = {
  appletEntities: Record<AppletId, EntitiesCompletionsDto>;
};

export interface IProgressDataCollector {
  collect(): Promise<CollectRemoteCompletionsResult>;
}

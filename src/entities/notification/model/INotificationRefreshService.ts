import { QueryClient } from '@tanstack/react-query';

import {
  EntityProgression,
  EntityResponseTime,
} from '@app/abstract/lib/types/entityProgress';
import { LogTrigger } from '@app/shared/api/services/INotificationService';

export type INotificationRefreshService = {
  refresh: (
    queryClient: QueryClient,
    progressions: EntityProgression[],
    responseTimes: EntityResponseTime[],
    logTrigger: LogTrigger,
  ) => Promise<void>;
};

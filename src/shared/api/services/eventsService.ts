import {
  callApiWithRetry,
  withDataExtraction,
} from '@app/shared/lib/utils/networkHelpers';

import { httpService } from './httpService';
import {
  AllEventsResponse,
  CompletedEntitiesRequest,
  CompletedEntitiesResponse,
  IEventsService,
} from './IEventsService';

export function eventsService(): IEventsService {
  return {
    getAllEvents() {
      const apiCall = () =>
        httpService.get<AllEventsResponse>(
          '/users/me/respondent/current_events',
        );

      return callApiWithRetry(withDataExtraction(apiCall));
    },
    getAllCompletedEntities(request: CompletedEntitiesRequest) {
      const apiCall = () =>
        httpService.get<CompletedEntitiesResponse>(
          '/answers/applet/completions',
          {
            params: {
              fromDate: request.fromDate,
            },
          },
        );
      return callApiWithRetry(withDataExtraction(apiCall));
    },
  };
}

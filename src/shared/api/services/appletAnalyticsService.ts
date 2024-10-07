import { withDataExtraction } from '@app/shared/lib/utils/networkHelpers';

import { httpService } from './httpService';
import {
  ActivityAnalyticsRequest,
  ActivityAnalyticsResponse,
  IAppletAnalyticsService,
} from './IAppletAnalyticsService';

export function appletAnalyticsService(): IAppletAnalyticsService {
  return {
    async getActivityAnalytics(request: ActivityAnalyticsRequest) {
      const apiCall = () =>
        httpService.get<ActivityAnalyticsResponse>(
          `/answers/applet/${request.appletId}/data`,
          {
            params: {
              fromDate: request.fromDate,
              activitiesLastVersion: request.isLastVersion,
              respondentIds: request.respondentIds,
            },
          },
        );
      return withDataExtraction(apiCall)();
    },
  };
}

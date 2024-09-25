import {
  callApiWithRetry,
  withDataExtraction,
} from '@app/shared/lib/utils/networkHelpers';

import { httpService } from './httpService';
import {
  AppletAndActivitiesDetailsRequest,
  AppletAndActivitiesDetailsResponse,
  AppletAssignmentsRequest,
  AppletAssignmentsResponse,
  AppletDetailsRequest,
  AppletDetailsResponse,
  AppletsResponse,
  IAppletService,
} from './IAppletService';

export function appletsService(): IAppletService {
  return {
    getApplets() {
      const apiCall = () =>
        httpService.get<AppletsResponse>('/applets', {
          params: { roles: 'respondent' },
        });
      return callApiWithRetry(withDataExtraction(apiCall));
    },
    getAppletDetails(request: AppletDetailsRequest) {
      const apiCall = () => {
        return httpService.get<AppletDetailsResponse>(
          `/applets/${request.appletId}`,
        );
      };
      return callApiWithRetry(withDataExtraction(apiCall));
    },
    getAppletAndActivitiesDetails(request: AppletAndActivitiesDetailsRequest) {
      const apiCall = () => {
        return httpService.get<AppletAndActivitiesDetailsResponse>(
          `/activities/applet/${request.appletId}`,
        );
      };
      return callApiWithRetry(withDataExtraction(apiCall));
    },
    getAppletAssignments(request: AppletAssignmentsRequest) {
      const apiCall = () => {
        return httpService.get<AppletAssignmentsResponse>(
          `/users/me/assignments/${request.appletId}`,
        );
      };
      return callApiWithRetry(withDataExtraction(apiCall));
    },
  };
}

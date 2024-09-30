import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
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
    async getApplets() {
      const apiCall = () =>
        httpService.get<AppletsResponse>('/applets', {
          params: { roles: 'respondent' },
        });
      return await callApiWithRetry(withDataExtraction(apiCall));
    },
    async getAppletDetails(request: AppletDetailsRequest) {
      const apiCall = () => {
        return httpService.get<AppletDetailsResponse>(
          `/applets/${request.appletId}`,
        );
      };
      return await callApiWithRetry(withDataExtraction(apiCall));
    },
    async getAppletAndActivitiesDetails(
      request: AppletAndActivitiesDetailsRequest,
    ) {
      const apiCall = () => {
        return httpService.get<AppletAndActivitiesDetailsResponse>(
          `/activities/applet/${request.appletId}`,
        );
      };
      const apiResponse = await callApiWithRetry(withDataExtraction(apiCall));

      // Currently, the activity items in `apiResponse.data.result.appletDetail.activities`
      // do not include the `autoAssign` attribute. So we have to patch the
      // value from items in `apiResponse.data.result.activitiesDetails`.
      // TODO: Remove this patch after API is updated.
      (apiResponse?.data?.result?.appletDetail?.activities || []).map(
        appletDetailActivity => {
          if (
            appletDetailActivity.autoAssign === null ||
            appletDetailActivity.autoAssign === undefined
          ) {
            const activityId = appletDetailActivity.id;

            const activityDetail =
              (apiResponse?.data?.result?.activitiesDetails || []).find(
                ({ id }) => id === activityId,
              ) || null;

            if (activityDetail) {
              appletDetailActivity.autoAssign = activityDetail.autoAssign;
              getDefaultLogger().warn(
                `Patched 'autoAssign' in getAppletAndActivitiesDetails response appletDetail.activities id: ${activityId}`,
              );
            } else {
              getDefaultLogger().error(
                `Unable to patch 'autoAssign' in getAppletAndActivitiesDetails response appletDetail.activities id: ${activityId}`,
              );
            }
          }
          return appletDetailActivity;
        },
      );

      return apiResponse;
    },
    async getAppletAssignments(request: AppletAssignmentsRequest) {
      const apiCall = () => {
        return httpService.get<AppletAssignmentsResponse>(
          `/users/me/assignments/${request.appletId}`,
        );
      };
      return await callApiWithRetry(withDataExtraction(apiCall));
    },
  };
}

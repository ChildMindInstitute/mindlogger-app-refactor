import { callApiWithRetry } from '@app/shared/lib/utils/networkHelpers';

import { httpService } from './httpService';
import {
  IOneUpHealthService,
  OneUpHealthRetrieveTokenRequest,
  OneUpHealthRetrieveTokenResponse,
  OneUpHealthSystemSearchRequest,
  OneUpHealthSystemSearchResponse,
} from './IOneUpHealthService';

export function oneUpHealthService(): IOneUpHealthService {
  return {
    retrieveOneUpHealthToken: async ({
      appletId,
      submitId,
      activityId,
    }: OneUpHealthRetrieveTokenRequest) => {
      const apiCall = async () => {
        return httpService.get<OneUpHealthRetrieveTokenResponse>(
          `/integrations/oneup_health/applet/${appletId}/submission/${submitId}/activity/${activityId}/token`,
        );
      };

      return await callApiWithRetry(apiCall);
    },

    systemSearch: async (
      {
        searchQuery: query,
        offset,
        systemType,
      }: OneUpHealthSystemSearchRequest,
      axiosInstance,
    ) => {
      return axiosInstance.post<OneUpHealthSystemSearchResponse>(
        `/search`,
        undefined,
        {
          params: {
            query,
            offset,
            system_type: systemType,
          },
        },
      );
    },
  };
}

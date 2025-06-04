import { ONEUP_HEALTH_CLIENT_ID } from '@app/shared/lib/constants';
import { callApiWithRetry } from '@app/shared/lib/utils/networkHelpers';

import { httpService } from './httpService';
import {
  IOneUpHealthService,
  OneUpHealthHealthSystemUrlResponse,
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

    getHealthSystemUrl: async (id, axiosInstance) => {
      return axiosInstance.get<OneUpHealthHealthSystemUrlResponse>(
        `/clinical/${id}`,
        {
          params: {
            sendRedirectUrlAsResponse: 'true',
          },
          headers: {
            'X-Client-Id': ONEUP_HEALTH_CLIENT_ID,
          },
        },
      );
    },
  };
}

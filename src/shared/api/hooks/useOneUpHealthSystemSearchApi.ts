import { useMemo } from 'react';

import { AxiosInstance } from 'axios';

import { useBaseQuery } from './useBaseQuery';
import { getOneUpHealthAxiosInstance } from '../services/httpService';
import {
  OneUpHealthRetrieveTokenRequest,
  OneUpHealthSystemSearchRequest,
} from '../services/IOneUpHealthService';
import { getDefaultOneUpHealthService } from '../services/oneUpHealthServiceInstance';

export const useOneUpHealthSystemSearchApi = (
  { appletId, submitId, activityId }: Partial<OneUpHealthRetrieveTokenRequest>,
  searchRequest: OneUpHealthSystemSearchRequest,
) => {
  /* Get access token from BE
  =================================================== */
  const oneUpHealthService = getDefaultOneUpHealthService();
  const {
    data: tokenData,
    isLoading: isTokenLoading,
    error: tokenError,
  } = useBaseQuery(
    ['oneup-health-token', { appletId, submitId, activityId }],
    () =>
      oneUpHealthService.retrieveOneUpHealthToken({
        appletId,
        submitId,
        activityId,
      } as OneUpHealthRetrieveTokenRequest),
    {
      enabled: !!(appletId && submitId && activityId),
    },
  );
  const accessToken = tokenData?.data?.result.accessToken;

  /* Initialize 1UpHealth Axios instance
  =================================================== */
  const axiosInstance = useMemo(
    () => (accessToken ? getOneUpHealthAxiosInstance(accessToken) : null),
    [accessToken],
  );

  /* Perform system search on 1UpHealth
  =================================================== */
  const {
    data: systemSearchData,
    isLoading: isSystemSearchLoading,
    error: systemSearchError,
  } = useBaseQuery(
    ['oneup-health-system-search', { accessToken, ...searchRequest }],
    () =>
      oneUpHealthService.systemSearch(
        searchRequest,
        axiosInstance as AxiosInstance,
      ),
    { enabled: !!accessToken },
  );

  return {
    accessToken,
    searchResults: systemSearchData?.data,
    isLoading: isTokenLoading || isSystemSearchLoading,
    error: tokenError ?? systemSearchError,
  };
};

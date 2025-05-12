import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AxiosError, AxiosInstance } from 'axios';

import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { useBaseQuery } from './useBaseQuery';
import { useOneUpHealthBaseQuery } from './useOneUpHealthBaseQuery';
import { getOneUpHealthAxiosInstance } from '../services/httpService';
import {
  OneUpHealthRetrieveTokenRequest,
  OneUpHealthSystemItem,
  OneUpHealthSystemSearchRequest,
} from '../services/IOneUpHealthService';
import { getDefaultOneUpHealthService } from '../services/oneUpHealthServiceInstance';

const MAX_TOKEN_REFRESH_ATTEMPTS = 3;

export const useOneUpHealthSystemSearchApi = ({
  appletId,
  submitId,
  activityId,
}: Partial<OneUpHealthRetrieveTokenRequest>) => {
  const logger = getDefaultLogger();
  const [tokenRefreshAttempts, setTokenRefreshAttempts] = useState(0);
  const [searchRequest, setSearchRequest] =
    useState<OneUpHealthSystemSearchRequest>({});
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [allResults, setAllResults] = useState<OneUpHealthSystemItem[]>([]);
  const [selectedHealthSystemId, setSelectedHealthSystemId] = useState<
    number | null
  >(null);
  const isLoadingMore = useRef(false);

  /* Get access token from BE
  =================================================== */
  const oneUpHealthService = getDefaultOneUpHealthService();
  const {
    refetch: refetchToken,
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
  const accessToken = isTokenLoading
    ? null
    : tokenData?.data?.result.accessToken;

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
  } = useOneUpHealthBaseQuery(
    ['oneup-health-system-search', searchRequest],
    () =>
      oneUpHealthService.systemSearch(
        searchRequest,
        axiosInstance as AxiosInstance,
      ),
    { enabled: !!accessToken },
  );

  /* Handle search results and pagination
  =================================================== */
  useEffect(() => {
    const results = systemSearchData?.data;
    if (results && results.length > 0) {
      if (currentOffset === 0) {
        // If this is the first page, replace all results
        setAllResults(results);
      } else {
        // Otherwise append to existing results, with deduplication
        setAllResults(prev => {
          // Create a Set of existing IDs for O(1) lookup
          const existingIds = new Set(prev.map(item => item.id));

          // Filter out any results that already exist in our list
          const newUniqueResults = results.filter(
            item => !existingIds.has(item.id),
          );

          // Only append if we have new unique results
          return newUniqueResults.length > 0
            ? [...prev, ...newUniqueResults]
            : prev;
        });
      }
      isLoadingMore.current = false;
    }
  }, [systemSearchData, currentOffset]);

  /* Search and pagination functions
  =================================================== */
  const search = useCallback((query?: string) => {
    setCurrentOffset(0);
    setAllResults([]);
    setSearchRequest({ searchQuery: query, offset: 0 });
  }, []);

  const loadMore = useCallback(() => {
    if (
      isSystemSearchLoading ||
      isLoadingMore.current ||
      !systemSearchData?.data ||
      systemSearchData.data.length === 0
    ) {
      return;
    }

    isLoadingMore.current = true;
    const nextOffset = currentOffset + systemSearchData.data.length;
    setCurrentOffset(nextOffset);
    setSearchRequest(prev => ({ ...prev, offset: nextOffset }));
  }, [currentOffset, isSystemSearchLoading, systemSearchData]);

  /* Fetch URL of health system
  =================================================== */
  const {
    data: healthSystemUrlData,
    isFetching: isHealthSystemUrlLoading,
    error: healthSystemUrlError,
  } = useOneUpHealthBaseQuery(
    ['oneup-health-health-system-url', { id: selectedHealthSystemId }],
    () =>
      oneUpHealthService.getHealthSystemUrl(
        selectedHealthSystemId as number,
        axiosInstance as AxiosInstance,
      ),
    { enabled: !!accessToken && selectedHealthSystemId !== null },
  );

  /* Basic error handling
  =================================================== */
  useEffect(() => {
    const error = (systemSearchError || healthSystemUrlError) as AxiosError;
    if (!error) return;

    if (
      error?.status === 401 &&
      error?.message === 'An error occurred when processing the access token.'
    ) {
      // Handle expired token

      if (tokenRefreshAttempts >= MAX_TOKEN_REFRESH_ATTEMPTS) {
        // TODO: Display appropriate error message
        // https://mindlogger.atlassian.net/browse/M2-8981
        logger.error(
          `[useOneUpHealthSystemSearchApi] Could not refresh 1UpHealth token after ${MAX_TOKEN_REFRESH_ATTEMPTS} attempts`,
        );
        return;
      }

      logger.info(
        '[useOneUpHealthSystemSearchApi] 1UpHealth token expired, refreshing...',
      );

      setTokenRefreshAttempts(prev => prev + 1);

      refetchToken()
        .then(() => {
          logger.info(
            '[useOneUpHealthSystemSearchApi] 1UpHealth token refreshed',
          );
        })
        .catch(() => {
          logger.warn(
            '[useOneUpHealthSystemSearchApi] Failed to refresh 1UpHealth token',
          );
        });
    } else {
      // Log other errors
      //
      // TODO: Display appropriate error messages
      // https://mindlogger.atlassian.net/browse/M2-8981
      logger.error(
        `[useOneUpHealthSystemSearchApi] Error ${error.status}, message: ${error.message}`,
      );
    }
  }, [
    systemSearchError,
    healthSystemUrlError,
    refetchToken,
    logger,
    tokenRefreshAttempts,
  ]);

  return {
    accessToken,
    search,
    loadMore,
    results: allResults,
    isResultsLoading: isSystemSearchLoading,
    selectedHealthSystemId,
    setSelectedHealthSystemId,
    healthSystemUrl: healthSystemUrlData?.data?.authorization_url,
    isTokenLoading,
    isHealthSystemUrlLoading,
    error: tokenError ?? systemSearchError ?? healthSystemUrlError,
  };
};

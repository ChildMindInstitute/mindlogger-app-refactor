import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Config from 'react-native-config';

import { httpService } from '@app/shared/api/services/httpService';
import { createJob } from '@app/shared/lib/services/jobManagement';
import Reactotron from '@shared/config/reactotron.config';

/**
 * Reactotron Network Tracking Job
 *
 * Configures axios interceptors to log all network requests and responses
 * to Reactotron for debugging purposes.
 *
 * Features:
 * - Full request logging (method, URL, headers, body)
 * - Full response logging (status, headers, body, timing)
 * - Error logging with stack traces
 * - Sensitive data filtering (Authorization headers)
 *
 * Only active in dev environment.
 */

export default createJob(() => {
  if (Config.ENV !== 'dev') {
    return; // Only enable in dev environment
  }

  // Track request timing
  const requestTimings = new Map<string, number>();

  // Request interceptor - log outgoing requests
  httpService.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const requestId = `${config.method?.toUpperCase()}-${config.url}-${Date.now()}`;

      // Store request start time
      requestTimings.set(requestId, Date.now());

      // Prepare headers for logging (filter sensitive data)
      const logHeaders = { ...config.headers };
      if (logHeaders.Authorization) {
        // Show only that Authorization exists, not the actual token
        logHeaders.Authorization = 'Bearer ***';
      }

      // Log request to Reactotron
      Reactotron.display?.({
        name: '⬆️ HTTP REQUEST',
        preview: `${config.method?.toUpperCase()} ${config.url}`,
        value: {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          headers: logHeaders,
          params: config.params,
          data: config.data,
          timestamp: new Date().toISOString(),
        },
        important: false,
      });

      // Store request ID in config for response matching
      // @ts-ignore - metadata is not in the type definition but is supported
      config.metadata = { requestId };

      return config;
    },
    (error: AxiosError) => {
      // Log request errors
      Reactotron.error?.(error.message, error.stack || '');

      return Promise.reject(error);
    },
  );

  // Response interceptor - log responses
  httpService.interceptors.response.use(
    (response: AxiosResponse) => {
      const requestId = (response.config as any).metadata?.requestId;
      const startTime = requestTimings.get(requestId);
      const duration = startTime ? Date.now() - startTime : undefined;

      // Clean up timing data
      if (requestId) {
        requestTimings.delete(requestId);
      }

      // Prepare headers for logging
      const logHeaders = { ...response.headers };

      // Log response to Reactotron
      Reactotron.display?.({
        name: '⬇️ HTTP RESPONSE',
        preview: `${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
        value: {
          status: response.status,
          statusText: response.statusText,
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
          headers: logHeaders,
          data: response.data,
          duration: duration ? `${duration}ms` : 'unknown',
          timestamp: new Date().toISOString(),
        },
        important: false,
      });

      return response;
    },
    (error: AxiosError) => {
      const requestId = (error.config as any)?.metadata?.requestId;
      const startTime = requestId ? requestTimings.get(requestId) : undefined;
      const duration = startTime ? Date.now() - startTime : undefined;

      // Clean up timing data
      if (requestId) {
        requestTimings.delete(requestId);
      }

      // Log error response to Reactotron
      const errorMessage = `❌ ${error.response?.status || 'ERROR'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`;
      const errorDetails = `${error.message}\nDuration: ${duration ? `${duration}ms` : 'unknown'}\nResponse: ${JSON.stringify(error.response?.data, null, 2)}`;

      Reactotron.error?.(errorMessage, errorDetails);

      return Promise.reject(error);
    },
  );

  console.log('[Reactotron] Network tracking configured');
});

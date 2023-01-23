import { AxiosError, AxiosRequestConfig } from 'axios';

import { httpService, IdentityService } from '@shared/api';
import { createJob, TokenStorage } from '@shared/lib';

type RequestConfig = AxiosRequestConfig<any> & {
  retry?: boolean;
};

export default createJob(() => {
  httpService.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const config = error.config as RequestConfig;

      if (error.response?.status === 401 && !config?.retry) {
        config.retry = true;

        const refreshToken = TokenStorage.getString('refreshToken');
        const tokenType = TokenStorage.getString('tokenType');

        if (!refreshToken || !tokenType) {
          return Promise.reject(error);
        }

        try {
          const { data } = await IdentityService.refreshToken({ refreshToken });

          TokenStorage.set('accessToken', data.result.accessToken);
          TokenStorage.set('refreshToken', data.result.refreshToken);

          config.headers.Authorization = `${tokenType} ${data.result.accessToken}`;
        } catch (e) {
          Promise.reject(e);
        }

        return httpService(config);
      }

      return Promise.reject(error);
    },
  );
});

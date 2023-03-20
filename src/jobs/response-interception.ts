import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { SessionModel } from '@entities/session';
import { httpService, IdentityService } from '@shared/api';
import { createJob } from '@shared/lib';

type RequestConfig = InternalAxiosRequestConfig<any> & {
  retry?: boolean;
};

export default createJob(() => {
  httpService.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const config = error.config as RequestConfig;

      if (error.response?.status === 401 && !config?.retry) {
        config.retry = true;

        const { refreshToken, tokenType } = SessionModel.getSession();

        if (!refreshToken || !tokenType) {
          return Promise.reject(error);
        }

        try {
          const { data } = await IdentityService.refreshToken({ refreshToken });

          SessionModel.storeAccessToken(data.result.accessToken);
          SessionModel.storeRefreshToken(data.result.refreshToken);

          // @ts-ignore
          config.headers.Authorization = `${tokenType} ${data.result.accessToken}`;
        } catch (e) {
          SessionModel.refreshTokenFailed();
          Promise.reject(e);
        }

        return httpService(config);
      }

      return Promise.reject(error);
    },
  );
});

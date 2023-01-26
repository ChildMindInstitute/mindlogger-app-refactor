import { AxiosError, AxiosRequestConfig } from 'axios';

import { SessionModel } from '@entities/session';
import { httpService, IdentityService } from '@shared/api';
import { createJob, Emitter } from '@shared/lib';

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

        const { refreshToken, tokenType } = SessionModel.getSession();

        if (!refreshToken || !tokenType) {
          return Promise.reject(error);
        }

        try {
          const { data } = await IdentityService.refreshToken({ refreshToken });

          SessionModel.storeSession({
            accessToken: data.result.accessToken,
            refreshToken: data.result.refreshToken,
          });

          config.headers.Authorization = `${tokenType} ${data.result.accessToken}`;
        } catch (e) {
          Emitter.emit('refresh-token-fail');
          Promise.reject(e);
        }

        return httpService(config);
      }

      return Promise.reject(error);
    },
  );
});

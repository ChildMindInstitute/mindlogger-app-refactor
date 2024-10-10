import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { getDefaultSessionService } from '@app/entities/session/lib/sessionServiceInstance';
import {
  refreshTokenFailed,
  storeAccessToken,
  storeRefreshToken,
} from '@app/entities/session/model/operations';
import { httpService } from '@app/shared/api/services/httpService';
import { getDefaultIdentityService } from '@app/shared/api/services/identityServiceInstance';
import { createJob } from '@app/shared/lib/services/jobManagement';

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

        const { refreshToken, tokenType } =
          getDefaultSessionService().getSession();

        if (!refreshToken || !tokenType) {
          return Promise.reject(error);
        }

        try {
          const { data } = await getDefaultIdentityService().refreshToken({
            refreshToken,
          });

          storeAccessToken(data.result.accessToken);
          storeRefreshToken(data.result.refreshToken);

          // @ts-ignore
          config.headers.Authorization = `${tokenType} ${data.result.accessToken}`;
        } catch (e) {
          refreshTokenFailed();
          Promise.reject(e);
        }

        return httpService(config);
      }

      return Promise.reject(error);
    },
  );
});

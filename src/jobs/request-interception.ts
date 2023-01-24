import { httpService } from '@shared/api';
import { createJob, TokenStorage } from '@shared/lib';

export default createJob(() => {
  httpService.interceptors.request.use(
    config => {
      const accessToken = TokenStorage.getString('accessToken');
      const tokenType = TokenStorage.getString('tokenType');

      if (accessToken && tokenType) {
        config.headers.Authorization = `${tokenType} ${accessToken}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
});

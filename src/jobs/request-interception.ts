import i18n from 'i18next';

import { SessionModel } from '@entities/session';
import { httpService } from '@shared/api';
import { createJob, TIMEZONE } from '@shared/lib';

export default createJob(() => {
  httpService.interceptors.request.use(
    config => {
      const { accessToken, tokenType } = SessionModel.getSession();

      if (accessToken && tokenType) {
        config.headers.Authorization = `${tokenType} ${accessToken}`;
      }

      config.headers['Content-Language'] = i18n.resolvedLanguage;
      config.headers['X-Timezone'] = TIMEZONE;

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
});

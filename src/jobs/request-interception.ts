import i18n from 'i18next';

import { getDefaultSessionService } from '@app/entities/session/lib/sessionServiceInstance';
import { httpService } from '@app/shared/api/services/httpService';
import { TIMEZONE } from '@app/shared/lib/constants/dateTime';
import { createJob } from '@app/shared/lib/services/jobManagement';

export default createJob(() => {
  httpService.interceptors.request.use(
    config => {
      const { accessToken, tokenType } =
        getDefaultSessionService().getSession();

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

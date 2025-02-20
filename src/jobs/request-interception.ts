import { Platform, PlatformIOSStatic } from 'react-native';

import i18n from 'i18next';
import { PlatformAndroidStatic } from 'react-native/Libraries/Utilities/Platform';

import { getDefaultSessionService } from '@app/entities/session/lib/sessionServiceInstance';
import { httpService } from '@app/shared/api/services/httpService';
import { TIMEZONE } from '@app/shared/lib/constants/dateTime';
import { createJob } from '@app/shared/lib/services/jobManagement';
import { APP_VERSION } from '@shared/lib/constants';
import { getDefaultSystemRecord } from '@shared/lib/records/systemRecordInstance.ts';
import { getDefaultLogger } from '@shared/lib/services/loggerInstance.ts';

export default createJob(() => {
  httpService.interceptors.request.use(
    config => {
      const { accessToken, tokenType } =
        getDefaultSessionService().getSession();

      if (accessToken && tokenType) {
        config.headers.Authorization = `${tokenType} ${accessToken}`;
      }

      try {
        const deviceId = getDefaultSystemRecord().getDeviceId();
        if (deviceId) {
          config.headers['Device-Id'] = deviceId;
        }
      } catch (e) {
        try {
          // Try to log the error, but if that fails, ignore it
          const logger = getDefaultLogger();
          logger.error(`${e}`);
        } catch (_e) {
          // ignored
        }
      }

      config.headers['Content-Language'] = i18n.resolvedLanguage;
      config.headers['X-Timezone'] = TIMEZONE;
      config.headers['OS-Name'] = Platform.OS;
      config.headers['OS-Version'] = Platform.select({
        android: (Platform as PlatformAndroidStatic).constants.Release,
        ios: (Platform as PlatformIOSStatic).constants.systemName,
        default: Platform.Version.toString(),
      });
      config.headers['App-Version'] = APP_VERSION;

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
});

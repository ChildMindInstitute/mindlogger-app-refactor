import {
  APP_VERSION,
  META_APP_NAME,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from '@app/shared/lib/constants';

export const getClientInformation = () => ({
  appId: META_APP_NAME,
  appVersion: APP_VERSION!,
  width: VIEWPORT_WIDTH,
  height: VIEWPORT_HEIGHT,
});

import {
  APP_VERSION,
  META_APP_NAME,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from '@shared/lib';

const getMetaClientInformation = () => ({
  appId: META_APP_NAME,
  appVersion: APP_VERSION,
  width: Math.round(VIEWPORT_WIDTH),
  height: Math.round(VIEWPORT_HEIGHT),
});

export { getMetaClientInformation };

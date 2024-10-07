import { MMKV } from 'react-native-mmkv';

export interface IStorageInstanceManager {
  getSystemStorage: () => MMKV;
  getAnalyticsStorage: () => MMKV;
  getLocalizationStorage: () => MMKV;
  getNotificationQueueStorage: () => MMKV;
  getFlowProgressStorage: () => MMKV;

  getNavigationStorage: () => MMKV;
  getSessionStorage: () => MMKV;
  getUploadQueueStorage: () => MMKV;
  getActivityProgressStorage: () => MMKV;
  getUserInfoStorage: () => MMKV;
  getUserPrivateKeyStorage: () => MMKV;
}

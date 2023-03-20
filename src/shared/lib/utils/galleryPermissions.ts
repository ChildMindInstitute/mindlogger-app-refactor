import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';

import {
  GALLERY_ANDROID_PERMISSIONS,
  GALLERY_IOS_PERMISSIONS,
  IS_ANDROID,
} from '../constants';

const checkGalleryAndroidPermissions = async (): Promise<string> => {
  const statuses = await Permissions.checkMultiple(GALLERY_ANDROID_PERMISSIONS);

  if (
    statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
      Permissions.RESULTS.GRANTED &&
    statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] ===
      Permissions.RESULTS.GRANTED
  ) {
    return RESULTS.GRANTED;
  }

  return RESULTS.UNAVAILABLE;
};

const requestGalleryAndroidPermissions = async () => {
  const result = await Permissions.requestMultiple(GALLERY_ANDROID_PERMISSIONS);

  return (
    result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
    result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED
  );
};

const checkGalleryIOSPermissions = async (): Promise<string> => {
  return await Permissions.check(GALLERY_IOS_PERMISSIONS);
};

const requestGalleryIOSPermissions = async () => {
  return await Permissions.request(GALLERY_IOS_PERMISSIONS);
};

export const checkGalleryPermissions = () =>
  IS_ANDROID ? checkGalleryAndroidPermissions() : checkGalleryIOSPermissions();

export const requestGalleryPermissions = async () =>
  IS_ANDROID
    ? await requestGalleryAndroidPermissions()
    : await requestGalleryIOSPermissions();

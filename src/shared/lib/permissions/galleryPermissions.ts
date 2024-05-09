import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';

import {
  GALLERY_ANDROID_PERMISSIONS,
  GALLERY_IOS_PERMISSIONS,
  IS_ANDROID,
  IS_ANDROID_13_OR_HIGHER,
} from '../constants';

const checkGalleryAndroidPermissions = async (): Promise<string> => {
  const statuses = await Permissions.checkMultiple(GALLERY_ANDROID_PERMISSIONS);

  if (
    (statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
      Permissions.RESULTS.GRANTED &&
      statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] ===
        Permissions.RESULTS.GRANTED) ||
    IS_ANDROID_13_OR_HIGHER
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
  const permissionState = await Permissions.request(GALLERY_IOS_PERMISSIONS);

  return (
    permissionState === RESULTS.GRANTED || permissionState === RESULTS.LIMITED
  );
};

export const checkGalleryPermissions = () =>
  IS_ANDROID ? checkGalleryAndroidPermissions() : checkGalleryIOSPermissions();

export const requestGalleryPermissions = () =>
  IS_ANDROID
    ? requestGalleryAndroidPermissions()
    : requestGalleryIOSPermissions();

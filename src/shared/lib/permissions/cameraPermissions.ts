import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';

import {
  CAMERA_PERMISSIONS,
  GALLERY_ANDROID_PERMISSIONS,
  IS_ANDROID,
} from '../constants';

const checkCameraAndroidPermissions = async () => {
  const statuses = await Permissions.checkMultiple([
    CAMERA_PERMISSIONS!,
    ...GALLERY_ANDROID_PERMISSIONS!,
  ]);

  if (
    statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
    statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
    statuses[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED
  ) {
    return RESULTS.GRANTED;
  }

  return RESULTS.UNAVAILABLE;
};

const checkCameraIOSPermissions = async () => {
  return Permissions.check(CAMERA_PERMISSIONS!);
};

export const checkCameraPermissions = async () =>
  IS_ANDROID ? checkCameraAndroidPermissions() : checkCameraIOSPermissions();

const requestCameraIOSPermissions = async () => {
  return Permissions.request(CAMERA_PERMISSIONS!);
};

const requestCameraAndroidPermissions = async () => {
  const result = await Permissions.requestMultiple([
    CAMERA_PERMISSIONS!,
    ...GALLERY_ANDROID_PERMISSIONS!,
  ]);

  return (
    result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
    result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
    result[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED
  );
};

export const requestCameraPermissions = () =>
  IS_ANDROID
    ? requestCameraAndroidPermissions()
    : requestCameraIOSPermissions();

import Permissions from 'react-native-permissions';

import { CAMERA_PERMISSIONS } from '../constants';

export const checkCameraPermissions = async () => {
  return await Permissions.check(CAMERA_PERMISSIONS!);
};

export const requestCameraPermissions = async () => {
  return await Permissions.request(CAMERA_PERMISSIONS!);
};

import Permissions from 'react-native-permissions';

import { CAMERA_PERMISSIONS } from '../constants';

export const checkCameraPermissions = async () => {
  return Permissions.check(CAMERA_PERMISSIONS!);
};

export const requestCameraPermissions = async () => {
  return Permissions.request(CAMERA_PERMISSIONS!);
};

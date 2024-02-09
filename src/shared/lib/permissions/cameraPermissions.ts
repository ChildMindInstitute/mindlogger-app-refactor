import Permissions, { RESULTS } from 'react-native-permissions';

import { CAMERA_PERMISSIONS } from '../constants';

export const checkCameraPermissions = async () => Permissions.check(CAMERA_PERMISSIONS!);

export const requestCameraPermissions = async () =>
  (await Permissions.request(CAMERA_PERMISSIONS!)) === RESULTS.GRANTED;

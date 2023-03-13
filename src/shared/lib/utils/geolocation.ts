import Permissions from 'react-native-permissions';

import { LOCATION_PERMISSIONS } from '../constants';

const getLocationPermissions = async () =>
  await Permissions.request(LOCATION_PERMISSIONS!);

export default getLocationPermissions;

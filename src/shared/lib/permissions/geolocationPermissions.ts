import Permissions from 'react-native-permissions';

import { LOCATION_PERMISSIONS } from '../constants';

export const getLocationPermissions = async () => await Permissions.request(LOCATION_PERMISSIONS!);

import { useEffect, useState } from 'react';

import Permissions from 'react-native-permissions';

import { LOCATION_PERMISSIONS } from '../constants';

const useLocationPermissions = () => {
  const [locationPermission, setLocationPermission] = useState<string>('undetermined');

  useEffect(() => {
    Permissions.check(LOCATION_PERMISSIONS!).then(setLocationPermission);
  }, []);

  return locationPermission;
};

export default useLocationPermissions;

import { useEffect } from 'react';

import { onNotificationPermissionsDisabled } from '../alerts';
import { getNotificationPermissions } from '../permissions';

const useNotificationPermissions = () => {
  useEffect(() => {
    getNotificationPermissions().then(permissionStatus => {
      if (permissionStatus !== 'AUTHORIZED') {
        onNotificationPermissionsDisabled();
      }
    });
  }, []);
};

export default useNotificationPermissions;

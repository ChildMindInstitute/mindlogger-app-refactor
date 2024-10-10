import { useEffect } from 'react';

import { onNotificationPermissionsDisabled } from '../alerts/permissionAlerts';
import { getNotificationPermissions } from '../permissions/notificationPermissions';

export const useNotificationPermissions = () => {
  useEffect(() => {
    getNotificationPermissions().then(permissionStatus => {
      if (permissionStatus !== 'AUTHORIZED') {
        onNotificationPermissionsDisabled();
      }
    });
  }, []);
};

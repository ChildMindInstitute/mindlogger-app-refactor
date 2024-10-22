import { useEffect } from 'react';

import { onAlarmPermissionsDisabled } from '../alerts/permissionAlerts';
import { getAlarmPermissions } from '../permissions/notificationPermissions';

export const useAlarmPermissions = () => {
  useEffect(() => {
    getAlarmPermissions().then(status => {
      if (status === 'DISABLED') {
        onAlarmPermissionsDisabled();
      }
    });
  }, []);
};

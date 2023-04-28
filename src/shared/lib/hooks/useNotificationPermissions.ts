import { useEffect, useState } from 'react';

import {
  NotificationPermissionStatus,
  getNotificationPermissions,
} from '../permissions';

const useNotificationPermissions = () => {
  const [notificationPermissions, setNotificationPermissions] =
    useState<NotificationPermissionStatus>('NOT_DETERMINED');

  useEffect(() => {
    getNotificationPermissions().then(permissionStatus => {
      setNotificationPermissions(permissionStatus);
    });
  }, []);

  return notificationPermissions;
};

export default useNotificationPermissions;

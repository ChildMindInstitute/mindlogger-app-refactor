import { useEffect } from 'react';

import { onAlarmPermissionsDisabled } from '../alerts';
import { getAlarmPermissions } from '../permissions';

const useAlarmPermissions = () => {
  useEffect(() => {
    getAlarmPermissions().then(status => {
      if (status === 'DISABLED') {
        onAlarmPermissionsDisabled();
      }
    });
  }, []);
};

export default useAlarmPermissions;

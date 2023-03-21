import { useEffect, useState } from 'react';

import Permissions from 'react-native-permissions';

import { MICROPHONE_PERMISSIONS } from '../constants';

const useMicrophonePermissions = () => {
  const [microphonePermission, setMicrophonePermission] =
    useState<string>('undetermined');

  useEffect(() => {
    Permissions.check(MICROPHONE_PERMISSIONS!).then(setMicrophonePermission);
  }, []);

  return microphonePermission;
};

export default useMicrophonePermissions;

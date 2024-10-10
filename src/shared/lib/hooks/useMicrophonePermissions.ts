import { useEffect, useState } from 'react';

import { RESULTS } from 'react-native-permissions';

import { checkMicrophonePermissions } from '../permissions/microphonePermissions';

export const useMicrophonePermissions = () => {
  const [microphonePermission, setMicrophonePermission] = useState<string>(
    RESULTS.UNAVAILABLE,
  );

  useEffect(() => {
    checkMicrophonePermissions().then(setMicrophonePermission);
  }, []);

  return {
    isMicrophoneAccessGranted: microphonePermission === RESULTS.GRANTED,
  };
};

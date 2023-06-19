import { useEffect, useState } from 'react';

import { RESULTS } from 'react-native-permissions';

import { checkMicrophonePermissions } from '../permissions';

const useMicrophonePermissions = () => {
  const [microphonePermission, setMicrophonePermission] =
    useState<string>('undetermined');

  useEffect(() => {
    checkMicrophonePermissions().then(isGranted =>
      setMicrophonePermission(
        isGranted ? RESULTS.GRANTED : RESULTS.UNAVAILABLE,
      ),
    );
  }, []);

  return microphonePermission;
};

export default useMicrophonePermissions;

import { useEffect, useState } from 'react';

import { RESULTS } from 'react-native-permissions';

import { checkCameraPermissions } from '../permissions/cameraPermissions';

export const useCameraPermissions = () => {
  const [cameraPermission, setCameraPermission] = useState<string>(
    RESULTS.UNAVAILABLE,
  );

  useEffect(() => {
    checkCameraPermissions().then(setCameraPermission);
  }, []);
  return { isCameraAccessGranted: cameraPermission === RESULTS.GRANTED };
};

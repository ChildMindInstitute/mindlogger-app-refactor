import { useEffect, useState } from 'react';

import { RESULTS } from 'react-native-permissions';

import { checkCameraPermissions } from '../utils';

const useCameraPermissions = () => {
  const [cameraPermission, setCameraPermission] = useState<string>(
    RESULTS.UNAVAILABLE,
  );

  useEffect(() => {
    checkCameraPermissions().then(setCameraPermission);
  }, []);

  return { isCameraAccessGranted: cameraPermission === RESULTS.GRANTED };
};

export default useCameraPermissions;

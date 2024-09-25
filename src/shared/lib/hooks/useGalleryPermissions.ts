import { useEffect, useState } from 'react';

import { RESULTS } from 'react-native-permissions';

import { checkGalleryPermissions } from '../permissions/galleryPermissions';

export const useGalleryPermissions = () => {
  const [galleryPermission, setGalleryPermission] = useState<string>(
    RESULTS.UNAVAILABLE,
  );

  useEffect(() => {
    checkGalleryPermissions().then(setGalleryPermission);
  }, []);

  return {
    isGalleryAccessGranted:
      galleryPermission === RESULTS.GRANTED ||
      galleryPermission === RESULTS.LIMITED,
  };
};

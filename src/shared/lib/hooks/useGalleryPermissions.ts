import { useEffect, useState } from 'react';

import { RESULTS } from 'react-native-permissions';

import { checkGalleryPermissions } from '../utils';

const useGalleryPermissions = () => {
  const [galleryPermission, setGalleryPermission] = useState<string>(
    RESULTS.UNAVAILABLE,
  );

  useEffect(() => {
    checkGalleryPermissions().then(setGalleryPermission);
  }, []);

  return { isGalleryAccessGranted: galleryPermission === RESULTS.GRANTED };
};

export default useGalleryPermissions;

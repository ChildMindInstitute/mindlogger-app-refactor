import { useEffect, useState } from 'react';

import { RESULTS } from 'react-native-permissions';

import { checkGalleryPermissions } from '../permissions';

const useGalleryPermissions = () => {
  const [galleryPermission, setGalleryPermission] = useState<string>(RESULTS.UNAVAILABLE);

  useEffect(() => {
    checkGalleryPermissions().then(setGalleryPermission);
  }, []);

  return {
    isGalleryAccessGranted: galleryPermission === RESULTS.GRANTED || galleryPermission === RESULTS.LIMITED,
  };
};

export default useGalleryPermissions;

import { FC } from 'react';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import {
  colors,
  GALLERY_PHOTO_OPTIONS,
  PHOTO_TAKE_OPTIONS,
  requestCameraPermissions,
  requestGalleryPermissions,
  useCameraPermissions,
  useGalleryPermissions,
} from '@shared/lib';
import { PhotoIcon } from '@shared/ui';

import MediaInput from './MediaInput';
import MediaValue from './types';

type Props = {
  onChange: (value: MediaValue) => void;
  value?: MediaValue;
};

const PhotoItem: FC<Props> = ({ onChange, value }) => {
  const { isCameraAccessGranted } = useCameraPermissions();
  const { isGalleryAccessGranted } = useGalleryPermissions();

  const handlePickImage = (response: any) => {
    onChange(response);
  };

  const onShowImageGallery = async () => {
    if (isGalleryAccessGranted) {
      launchImageLibrary(GALLERY_PHOTO_OPTIONS, handlePickImage);
    } else {
      await requestGalleryPermissions();
    }
  };

  const onOpenPhotoCamera = async () => {
    if (isCameraAccessGranted) {
      launchCamera(PHOTO_TAKE_OPTIONS, handlePickImage);
    } else {
      await requestCameraPermissions();
    }
  };

  return (
    <MediaInput
      onOpenCamera={onOpenPhotoCamera}
      onShowMediaLibrary={onShowImageGallery}
      value={value}
      mode="photo"
    >
      <PhotoIcon color={colors.red} size={50} />
    </MediaInput>
  );
};

export default PhotoItem;

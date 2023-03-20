import { FC } from 'react';

import {
  Callback,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

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
  onChange: (value: MediaValue) => void | Callback;
  value?: MediaValue;
};

const PhotoItem: FC<Props> = ({ onChange, value }) => {
  const { isCameraAccessGranted } = useCameraPermissions();
  const { isGalleryAccessGranted } = useGalleryPermissions();

  const handlePickImage = (
    response: ImagePickerResponse,
    isFromLibrary: boolean,
  ) => {
    const { assets } = response;

    if (assets?.length) {
      const imageItem = assets[0];
      const photo = {
        uri: imageItem.uri,
        filename: imageItem.fileName,
        size: imageItem.fileSize,
        type: imageItem.type,
        fromLibrary: isFromLibrary,
      };

      onChange(photo);
    }
  };

  const onShowImageGallery = async () => {
    if (isGalleryAccessGranted) {
      launchImageLibrary(GALLERY_PHOTO_OPTIONS, response =>
        handlePickImage(response, true),
      );
    } else {
      await requestGalleryPermissions();
    }
  };

  const onOpenPhotoCamera = async () => {
    if (isCameraAccessGranted) {
      launchCamera(PHOTO_TAKE_OPTIONS, response =>
        handlePickImage(response, false),
      );
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

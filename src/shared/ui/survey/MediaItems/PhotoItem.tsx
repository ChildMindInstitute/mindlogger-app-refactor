import { FC, useState } from 'react';

import {
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
import { PhotoIcon, Image } from '@shared/ui';

import MediaInput from './MediaInput';
import MediaValue from './types';

type Props = {
  onChange: (value: MediaValue) => void;
  value?: MediaValue;
};

const PhotoItem: FC<Props> = ({ onChange, value }) => {
  const { isCameraAccessGranted } = useCameraPermissions();
  const { isGalleryAccessGranted } = useGalleryPermissions();
  const [pickedPhoto, setPickedPhoto] = useState(value);

  const pickImage = (response: ImagePickerResponse, isFromLibrary: boolean) => {
    const { assets } = response;

    if (assets?.length) {
      const imageItem = assets[0];
      const photo = {
        uri: imageItem.uri || '',
        fileName: imageItem.fileName || '',
        size: imageItem.fileSize || 0,
        type: imageItem.type || '',
        fromLibrary: isFromLibrary,
      };

      setPickedPhoto(photo);
      onChange(photo);
    }
  };

  const onShowImageGallery = async () => {
    if (isGalleryAccessGranted) {
      launchImageLibrary(GALLERY_PHOTO_OPTIONS, response =>
        pickImage(response, true),
      );
    } else {
      await requestGalleryPermissions();
    }
  };

  const onOpenPhotoCamera = async () => {
    if (isCameraAccessGranted) {
      launchCamera(PHOTO_TAKE_OPTIONS, response => pickImage(response, false));
    } else {
      await requestCameraPermissions();
    }
  };

  return (
    <MediaInput
      onOpenCamera={onOpenPhotoCamera}
      onShowMediaLibrary={onShowImageGallery}
      mode="photo"
    >
      {pickedPhoto ? (
        <Image height="100%" width="100%" src={{ uri: pickedPhoto.uri }} />
      ) : (
        <PhotoIcon color={colors.red} size={50} />
      )}
    </MediaInput>
  );
};

export default PhotoItem;

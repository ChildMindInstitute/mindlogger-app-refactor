import { FC } from 'react';

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

      onChange(photo);
    }
  };

  const selectImage = async () => {
    const response = await launchImageLibrary(GALLERY_PHOTO_OPTIONS);

    pickImage(response, true);
  };

  const takePhoto = async () => {
    const response = await launchCamera(PHOTO_TAKE_OPTIONS);

    pickImage(response, false);
  };

  const onShowImageGallery = async () => {
    if (isGalleryAccessGranted) {
      selectImage();
    } else {
      const permissionStatus = await requestGalleryPermissions();

      if (permissionStatus === 'granted') {
        selectImage();
      }
    }
  };

  const onOpenPhotoCamera = async () => {
    if (isCameraAccessGranted) {
      takePhoto();
    } else {
      const permissionStatus = await requestCameraPermissions();

      if (permissionStatus === 'granted') {
        takePhoto();
      }
    }
  };

  return (
    <MediaInput
      onOpenCamera={onOpenPhotoCamera}
      onShowMediaLibrary={onShowImageGallery}
      mode="photo"
    >
      {value ? (
        <Image height="100%" width="100%" src={{ uri: value.uri }} />
      ) : (
        <PhotoIcon color={colors.red} size={50} />
      )}
    </MediaInput>
  );
};

export default PhotoItem;

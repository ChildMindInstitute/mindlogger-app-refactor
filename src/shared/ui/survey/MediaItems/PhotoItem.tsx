import { FC } from 'react';

import { useTranslation } from 'react-i18next';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  colors,
  evaluateLocalFileUri,
  GALLERY_PHOTO_OPTIONS,
  handleBlockedPermissions,
  Logger,
  PHOTO_TAKE_OPTIONS,
  preparePhotoFile,
  requestCameraPermissions,
  requestGalleryPermissions,
  useCameraPermissions,
  useGalleryPermissions,
} from '@shared/lib';
import { PhotoIcon, Image } from '@shared/ui';

import MediaInput from './MediaInput';
import { MediaValue } from './types';

type Props = {
  onChange: (value: MediaValue) => void;
  value?: MediaValue;
};

const PhotoItem: FC<Props> = ({ onChange, value }) => {
  const { t } = useTranslation();
  const { isCameraAccessGranted } = useCameraPermissions();
  const { isGalleryAccessGranted } = useGalleryPermissions();

  const pickImage = async (
    response: ImagePickerResponse,
    isFromLibrary: boolean,
  ) => {
    const { assets } = response;

    if (!assets?.length) {
      Logger.warn('[PhotoItem.pickImage] an image has not been picked up.');
      return;
    }

    try {
      const imageItem = assets[0];

      const photo = await preparePhotoFile(imageItem, isFromLibrary);

      onChange(photo);
    } catch (error) {
      Logger.error(
        `[PhotoItem.pickImage] An error occurred during picking an image.
        error:
        ${error}`,
      );
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
      const isPermissionAllowed = await requestGalleryPermissions();

      if (isPermissionAllowed) {
        selectImage();
      } else {
        await handleBlockedPermissions(
          t('permissions:gallery'),
          t('media:alert_message'),
        );
      }
    }
  };

  const onOpenPhotoCamera = async () => {
    if (isCameraAccessGranted) {
      takePhoto();
    } else {
      const isPermissionAllowed = await requestCameraPermissions();

      if (isPermissionAllowed) {
        takePhoto();
      } else {
        await handleBlockedPermissions(
          t('permissions:camera'),
          t('media:alert_message'),
        );
      }
    }
  };

  return (
    <MediaInput
      borderColor={value ? '$green' : '$red'}
      onOpenCamera={onOpenPhotoCamera}
      onShowMediaLibrary={onShowImageGallery}
      mode="photo"
      accessibilityLabel="photo-item"
      uploadIcon={<PhotoIcon color={colors.red} size={50} />}
    >
      {value && (
        <Image
          height="100%"
          width="100%"
          src={{ uri: evaluateLocalFileUri(value.fileName) }}
        />
      )}
    </MediaInput>
  );
};

export default PhotoItem;

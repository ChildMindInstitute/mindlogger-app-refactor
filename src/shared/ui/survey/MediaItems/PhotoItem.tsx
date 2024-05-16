import { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { FileSystem } from 'react-native-file-access';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  colors,
  GALLERY_PHOTO_OPTIONS,
  handleBlockedPermissions,
  ImageConverter,
  Logger,
  PHOTO_TAKE_OPTIONS,
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

const preparePhotoFile = async (image: Asset, isFromLibrary: boolean) => {
  const isHeic = image.fileName?.includes('heic');

  if (isHeic) {
    try {
      const originalUri = image.uri!;

      const jpgImage = await ImageConverter.convertHeicToJpg(image);

      image = jpgImage;

      await FileSystem.unlink(originalUri);
    } catch (error) {
      Logger.error(error as string);
    }
  }

  const photoFile = {
    uri: image.uri || '',
    fileName: image.fileName || '',
    size: image.fileSize || 0,
    type: image.type || '',
    fromLibrary: isFromLibrary,
  };

  return photoFile;
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

    if (assets?.length) {
      const imageItem = assets[0];

      const photo = await preparePhotoFile(imageItem, isFromLibrary);

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
      {value && <Image height="100%" width="100%" src={value.uri} />}
    </MediaInput>
  );
};

export default PhotoItem;

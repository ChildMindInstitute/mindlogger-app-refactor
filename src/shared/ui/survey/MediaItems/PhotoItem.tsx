import { FC } from 'react';

import { useTranslation } from 'react-i18next';
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

const preparePhotoFile = (image: Asset, isFromLibrary: boolean) => {
  const fileName = image.fileName?.replace(/HEIC/gi, 'jpg') ?? '';
  const mimeType = image.type?.replace(/HEIC/gi, 'jpg') ?? '';

  const photoFile = {
    uri: image.uri || '',
    fileName,
    size: image.fileSize || 0,
    type: mimeType,
    fromLibrary: isFromLibrary,
  };

  return photoFile;
};

const PhotoItem: FC<Props> = ({ onChange, value }) => {
  const { t } = useTranslation();
  const { isCameraAccessGranted } = useCameraPermissions();
  const { isGalleryAccessGranted } = useGalleryPermissions();

  const pickImage = (response: ImagePickerResponse, isFromLibrary: boolean) => {
    const { assets } = response;

    if (assets?.length) {
      const imageItem = assets[0];

      const photo = preparePhotoFile(imageItem, isFromLibrary);

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
          '"MindLogger" would like to use your gallery to complete this task', // @todo add specific translations for photo camera
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
          '"MindLogger" would like to use your camera to complete this task', // @todo add specific translations for photo camera
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
      {value && <Image height="100%" width="100%" src={{ uri: value.uri }} />}
    </MediaInput>
  );
};

export default PhotoItem;

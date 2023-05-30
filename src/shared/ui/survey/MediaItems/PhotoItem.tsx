import { FC } from 'react';

import { useTranslation } from 'react-i18next';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  colors,
  GALLERY_PHOTO_OPTIONS,
  handleBlockedPermissions,
  IS_ANDROID_11_OR_HIGHER,
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
  const { t } = useTranslation();
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
    if (isGalleryAccessGranted || IS_ANDROID_11_OR_HIGHER) {
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
    if (isCameraAccessGranted || IS_ANDROID_11_OR_HIGHER) {
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
      hasValue={!!value}
      onOpenCamera={onOpenPhotoCamera}
      onShowMediaLibrary={onShowImageGallery}
      mode="photo"
      uploadIcon={<PhotoIcon color={colors.red} size={50} />}
    >
      {value && <Image height="100%" width="100%" src={{ uri: value.uri }} />}
    </MediaInput>
  );
};

export default PhotoItem;

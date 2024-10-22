import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import { handleBlockedPermissions } from '@app/shared/lib/alerts/permissionAlerts';
import {
  GALLERY_VIDEO_OPTIONS,
  VIDEO_RECORD_OPTIONS,
} from '@app/shared/lib/constants';
import { colors } from '@app/shared/lib/constants/colors';
import { useCameraPermissions } from '@app/shared/lib/hooks/useCameraPermissions';
import { useGalleryPermissions } from '@app/shared/lib/hooks/useGalleryPermissions';
import { requestCameraPermissions } from '@app/shared/lib/permissions/cameraPermissions';
import { requestGalleryPermissions } from '@app/shared/lib/permissions/galleryPermissions';

import { MediaInput } from './MediaInput';
import { MediaValue } from './types';
import { VideoIcon } from '../../icons';
import { VideoPlayer } from '../VideoPlayer';

type Props = {
  onChange: (value: MediaValue) => void;
  value?: MediaValue;
};

const styles = StyleSheet.create({
  mediaContainer: {
    height: '100%',
    borderRadius: 10,
  },
});

export const VideoItem: FC<Props> = ({ value, onChange }) => {
  const { isCameraAccessGranted } = useCameraPermissions();
  const { isGalleryAccessGranted } = useGalleryPermissions();
  const { t } = useTranslation();

  const pickVideo = (response: ImagePickerResponse, isFromLibrary: boolean) => {
    const { assets } = response;

    if (assets?.length) {
      const videoItem = assets[0];
      const videoUpload = {
        uri: videoItem.uri || '',
        fileName: videoItem.fileName || '',
        size: videoItem.fileSize || 0,
        type: videoItem.type || '',
        fromLibrary: isFromLibrary,
      };

      onChange(videoUpload);
    }
  };

  const selectVideo = async () => {
    const response = await launchImageLibrary(GALLERY_VIDEO_OPTIONS);

    pickVideo(response, true);
  };

  const recordVideo = async () => {
    const response = await launchCamera(VIDEO_RECORD_OPTIONS);

    pickVideo(response, false);
  };

  const onShowVideoGallery = async () => {
    if (isGalleryAccessGranted) {
      selectVideo();
    } else {
      const isPermissionAllowed = await requestGalleryPermissions();

      if (isPermissionAllowed) {
        selectVideo();
      } else {
        await handleBlockedPermissions(
          t('permissions:gallery'),
          t('media:alert_message'),
        );
      }
    }
  };

  const onOpenVideoCamera = async () => {
    if (isCameraAccessGranted) {
      recordVideo();
    } else {
      const isPermissionAllowed = await requestCameraPermissions();

      if (isPermissionAllowed) {
        recordVideo();
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
      onOpenCamera={onOpenVideoCamera}
      onShowMediaLibrary={onShowVideoGallery}
      mode="video"
      accessibilityLabel="video-item"
      uploadIcon={<VideoIcon color={colors.red} size={50} />}
    >
      {value && (
        <VideoPlayer
          wrapperStyle={styles.mediaContainer}
          videoStyle={styles.mediaContainer}
          thumbnailStyle={styles.mediaContainer}
          uri={value.uri}
          resizeMode="contain"
        />
      )}
    </MediaInput>
  );
};

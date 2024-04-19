import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  colors,
  evaluateLocalFileUri,
  GALLERY_VIDEO_OPTIONS,
  handleBlockedPermissions,
  Logger,
  prepareVideoFile,
  requestCameraPermissions,
  requestGalleryPermissions,
  useCameraPermissions,
  useGalleryPermissions,
  VIDEO_RECORD_OPTIONS,
} from '@app/shared/lib';
import { VideoIcon, VideoPlayer } from '@shared/ui';

import MediaInput from './MediaInput';
import { MediaValue } from './types';

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

const VideoItem: FC<Props> = ({ value, onChange }) => {
  const { isCameraAccessGranted } = useCameraPermissions();
  const { isGalleryAccessGranted } = useGalleryPermissions();
  const { t } = useTranslation();

  const pickVideo = async (
    response: ImagePickerResponse,
    isFromLibrary: boolean,
  ) => {
    const { assets } = response;

    if (!assets?.length) {
      Logger.warn('[VideoItem.pickVideo] an image has not been picked up.');
      return;
    }

    try {
      const videoItem = assets[0];

      const video = await prepareVideoFile(videoItem, isFromLibrary);

      onChange(video);
    } catch (error) {
      Logger.error(
        `[VideoItem.pickVideo] An error occurred during picking a video.
        Error:
        ${error}`,
      );
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
          uri={evaluateLocalFileUri(value.fileName)}
          resizeMode="contain"
        />
      )}
    </MediaInput>
  );
};

export default VideoItem;

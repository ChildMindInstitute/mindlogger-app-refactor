import { FC } from 'react';

import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  colors,
  GALLERY_VIDEO_OPTIONS,
  requestCameraPermissions,
  requestGalleryPermissions,
  useCameraPermissions,
  useGalleryPermissions,
  VIDEO_RECORD_OPTIONS,
} from '@app/shared/lib';
import { VideoIcon, VideoPlayer } from '@shared/ui';

import MediaInput from './MediaInput';
import MediaValue from './types';

type Props = {
  onChange: (value: MediaValue) => void;
  value?: MediaValue;
};

const VideoItem: FC<Props> = ({ value, onChange }) => {
  const { isCameraAccessGranted } = useCameraPermissions();
  const { isGalleryAccessGranted } = useGalleryPermissions();

  const pickImage = (response: ImagePickerResponse, isFromLibrary: boolean) => {
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

  const onShowVideoGallery = async () => {
    if (isGalleryAccessGranted) {
      const response = await launchImageLibrary(GALLERY_VIDEO_OPTIONS);

      pickImage(response, true);
    } else {
      await requestGalleryPermissions();
    }
  };

  const onOpenVideoCamera = async () => {
    if (isCameraAccessGranted) {
      const response = await launchCamera(VIDEO_RECORD_OPTIONS);

      pickImage(response, false);
    } else {
      await requestCameraPermissions();
    }
  };
  return (
    <MediaInput
      onOpenCamera={onOpenVideoCamera}
      onShowMediaLibrary={onShowVideoGallery}
      mode="video"
    >
      {value ? (
        <VideoPlayer uri={value.uri} />
      ) : (
        <VideoIcon color={colors.red} size={50} />
      )}
    </MediaInput>
  );
};

export default VideoItem;

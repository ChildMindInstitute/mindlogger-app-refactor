import { FileSystem } from 'react-native-file-access';
import { Asset } from 'react-native-image-picker';

import { getFilenameFromLocalUri, evaluateLocalFileUri } from './file';
import { ImageConverter } from './imageConverter';
import { IS_IOS } from '../constants';

export const moveMediaFileToCache = async (
  fileName: string,
  fromUri: string,
) => {
  const localFileUri = evaluateLocalFileUri(fileName!);

  let fileExists = await FileSystem.exists(localFileUri);

  if (fileExists) {
    await FileSystem.unlink(localFileUri);
  }

  await FileSystem.mv(fromUri, localFileUri);

  return localFileUri;
};

export const preparePhotoFile = async (
  image: Asset,
  isFromLibrary: boolean,
) => {
  const isHeic = image.fileName?.includes('heic');

  if (isHeic) {
    try {
      const originalUri = image.uri!;

      const jpgImage = await ImageConverter.convertHeicToJpg(image);

      image = jpgImage;

      await FileSystem.unlink(originalUri);
    } catch (error) {
      throw Error(
        `[preparePhotoFile] An error occurred during file conversion from HEIC.
        error:
        ${error}`,
      );
    }
  }

  let localFileUri = image.uri!;
  let fileName = image.fileName!;

  if (IS_IOS) {
    /**
     * On iOS, react-native-image-picker puts images to the /tmp/ folder.
     * We need to move the file to CacheDir to keep the files in one place.
     * */
    localFileUri = await moveMediaFileToCache(image.fileName!, image.uri!);

    /** Double-check if the image has been moved correctly */
    const fileExists = await FileSystem.exists(localFileUri);

    if (!fileExists) {
      throw Error(
        `[preparePhotoFile] Failed to move file from ${image.uri} to ${localFileUri}.
          The file has not been found in the ${localFileUri}`,
      );
    }
  } else {
    /**
     * On Android, react-native-image-picker returns an object
     * that with different file names in the "fileName" and "uri" fields.
     * If we try to access a photo (taken from camera roll or Library)
     * in File System using the "fileName" field
     * we will get a "File not found" error.
     * Most likely a bug because it is not reproduced on iOS devices.
     * */
    fileName = getFilenameFromLocalUri(localFileUri);

    if (!fileName?.length) {
      throw Error(
        `[preparePhotoFile] Failed to fetch a name from the file uri: ${localFileUri}`,
      );
    }
  }

  const photoFile = {
    fileName,
    size: image.fileSize || 0,
    type: image.type || '',
    fromLibrary: isFromLibrary,
  };

  return photoFile;
};

export const prepareVideoFile = async (
  video: Asset,
  isFromLibrary: boolean,
) => {
  let localFileUri = video.uri!;
  let fileName = video.fileName!;

  if (IS_IOS) {
    /**
     * On iOS, react-native-image-picker may put videos to the /tmp/ folder.
     * We need to move the file to CacheDir to keep the files in one place.
     * */
    localFileUri = await moveMediaFileToCache(video.fileName!, video.uri!);

    /** Double-check if the video has been moved correctly */
    const fileExists = await FileSystem.exists(localFileUri);

    if (!fileExists) {
      throw Error(
        `[prepareVideoFile] Failed to move file from ${video.uri} to ${localFileUri}.
          The file has not been found in the ${localFileUri}`,
      );
    }
  } else {
    /**
     * On Android, react-native-image-picker returns an object
     * that with different file names in the "fileName" and "uri" fields.
     * If we try to access a video (taken from Library)
     * in File System using the "fileName" field
     * we will get a "File not found" error.
     * Most likely a bug because it is not reproduced on iOS devices.
     * */

    fileName = getFilenameFromLocalUri(localFileUri);

    if (!fileName?.length) {
      throw Error(
        `[prepareVideoFile] Failed to fetch a name from the file uri: ${localFileUri}`,
      );
    }
  }

  const videoFile = {
    fileName,
    size: video.fileSize || 0,
    type: video.type || '',
    fromLibrary: isFromLibrary,
  };

  return videoFile;
};

import { Dirs, FileSystem } from 'react-native-file-access';

import {
  ActivityItemType,
  ActivityState,
  MediaFile,
  PipelineItem,
} from './MigrationStorageTypes0002';
import { Storages } from '../../types';
import {
  getStorageRecord,
  getStorageRecordKeys,
  upsertStorageRecord,
} from '../../utils';

export const getActivityState = (key: string): ActivityState | null =>
  getStorageRecord(Storages.ActivityProgress, key);

export const updateActivityState = (key: string, state: ActivityState) => {
  upsertStorageRecord(Storages.ActivityProgress, key, state);
};

export const getActivityStorageKeys = () =>
  getStorageRecordKeys(Storages.ActivityProgress);

const getFilenameFromLocalUri = (localUri: string) => {
  const regex = /^file:\/\/(?:.*\/)?([^/]+)$/;
  const match = localUri.match(regex);

  return match ? match[1] : '';
};

export const evaluateLocalFileUri = (fileName: string) =>
  `file://${Dirs.CacheDir}/${fileName}`;

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

  /** Double-check if the image has been moved correctly */
  fileExists = await FileSystem.exists(localFileUri);

  if (!fileExists) {
    throw Error(
      `[moveFileToCacheDir] Failed to move file from ${fromUri} to ${localFileUri}.
        The file has not been found in the ${localFileUri}`,
    );
  }

  return localFileUri;
};

export const renameMediaFile = (mediaFile: MediaFile) => {
  mediaFile.fileName = getFilenameFromLocalUri(mediaFile.uri);

  if (!mediaFile.fileName) {
    throw Error(
      `[renameMediaFile] Failed to rename file ${mediaFile.fileName} of ${mediaFile.type} type, located in ${mediaFile.uri} }`,
    );
  }
};

const MEDIA_ITEM_TYPES: Array<ActivityItemType> = ['Photo', 'Video'];

export const isVideoOrPhotoItem = (item: PipelineItem) =>
  MEDIA_ITEM_TYPES.includes(item.type);

export const isAudioItem = (item: PipelineItem) => item.type === 'Audio';

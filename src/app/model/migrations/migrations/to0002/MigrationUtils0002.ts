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

export const evaluateFileCacheUri = (fileName: string) =>
  `file://${Dirs.CacheDir}/${fileName}`;

export const moveMediaFileToCache = async (
  fileName: string,
  fromLocalUri: string,
) => {
  const cacheFileUri = evaluateFileCacheUri(fileName);

  const localFileExists = await FileSystem.exists(fromLocalUri);

  if (!localFileExists) {
    throw Error(
      `[moveFileToCacheDir] Failed to move file from ${fromLocalUri} to ${cacheFileUri}.
        The file local file has not been found in the ${fromLocalUri}`,
    );
  }

  await FileSystem.mv(fromLocalUri, cacheFileUri);

  /** Double-check if the image has been moved correctly */
  const cacheFileExists = await FileSystem.exists(cacheFileUri);

  if (!cacheFileExists) {
    throw Error(
      `[moveFileToCacheDir] Failed to move file from ${fromLocalUri} to ${cacheFileUri}.
        The file has not been found in the ${cacheFileUri}`,
    );
  }

  return cacheFileUri;
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

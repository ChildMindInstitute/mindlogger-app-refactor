import { Dirs } from 'react-native-file-access';

import { IS_ANDROID } from '../constants';

export const isLocalFileUrl = (value: string) => {
  const localFileRegex =
    /^(file:\/\/|\/).*\/[^\/]+?\.(jpg|jpeg|png|gif|mp4|m4a|mov|MOV|svg|mpeg)$/;

  return localFileRegex.test(value);
};

export const getFilePath = (path: string) =>
  IS_ANDROID ? `file://${path}` : path;

export const evaluateLocalFileUri = (fileName: string) =>
  `file://${Dirs.CacheDir}/${fileName}`;

export const getFilenameFromLocalUri = (localUri: string) => {
  const regex = /^file:\/\/(?:.*\/)?([^/]+)$/;
  const match = localUri.match(regex);

  return match ? match[1] : '';
};

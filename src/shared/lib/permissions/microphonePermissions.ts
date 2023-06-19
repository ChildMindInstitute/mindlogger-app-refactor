import { Platform } from 'react-native';

import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';

import { IS_ANDROID_13_OR_HIGHER } from '../constants';

const AUDIO_RECORD_PERMISSIONS = Platform.select({
  ios: [PERMISSIONS.IOS.MICROPHONE],
  android: [
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    ...(!IS_ANDROID_13_OR_HIGHER
      ? [
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]
      : []),
  ],
});

export const checkMicrophonePermissions = async (): Promise<boolean> => {
  const result = (await Permissions.checkMultiple(
    AUDIO_RECORD_PERMISSIONS!,
  )) as Record<string, string>;

  return Object.keys(result)
    .map((permission: string) => result[permission] === RESULTS.GRANTED)
    .every(Boolean);
};

export const getMicrophonePermissions = async (): Promise<boolean> => {
  const result = (await Permissions.requestMultiple(
    AUDIO_RECORD_PERMISSIONS!,
  )) as Record<string, string>;

  return Object.keys(result)
    .map((permission: string) => result[permission] === RESULTS.GRANTED)
    .every(Boolean);
};

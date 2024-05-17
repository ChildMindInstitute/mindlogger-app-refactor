import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';

import { IS_ANDROID_13_OR_HIGHER } from '../constants';
import { IS_ANDROID } from '../constants';

const checkMicrophoneIOSPermissions = async () => {
  const result = await Permissions.check(PERMISSIONS.IOS.MICROPHONE);

  return result;
};

const checkMicrophoneAndroidPermissions = async (): Promise<string> => {
  const result = await Permissions.checkMultiple([
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    ...(!IS_ANDROID_13_OR_HIGHER
      ? [
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]
      : []),
  ]);

  const microphoneAccessStatus = result[PERMISSIONS.ANDROID.RECORD_AUDIO];

  if (IS_ANDROID_13_OR_HIGHER) {
    return microphoneAccessStatus;
  } else if (
    microphoneAccessStatus === RESULTS.GRANTED &&
    result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
    result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED
  ) {
    return RESULTS.GRANTED;
  } else {
    return RESULTS.DENIED;
  }
};

export const checkMicrophonePermissions = async () =>
  IS_ANDROID
    ? checkMicrophoneAndroidPermissions()
    : checkMicrophoneIOSPermissions();

const getMicrophoneAndroidPermissions = async (): Promise<boolean> => {
  const result = (await Permissions.requestMultiple([
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    ...(!IS_ANDROID_13_OR_HIGHER
      ? [
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]
      : []),
  ])) as Record<string, string>;

  return Object.keys(result)
    .map((permission: string) => result[permission] === RESULTS.GRANTED)
    .every(Boolean);
};

const getMicrophoneIOSPermissions = async (): Promise<boolean> => {
  const result = await Permissions.request(PERMISSIONS.IOS.MICROPHONE!);

  return result === RESULTS.GRANTED;
};

export const requestMicrophonePermissions = () =>
  IS_ANDROID
    ? getMicrophoneAndroidPermissions()
    : getMicrophoneIOSPermissions();

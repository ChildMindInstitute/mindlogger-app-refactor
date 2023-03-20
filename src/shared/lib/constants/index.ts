import { Platform } from 'react-native';

import Config from 'react-native-config';
import { ImageLibraryOptions } from 'react-native-image-picker';
import { PERMISSIONS } from 'react-native-permissions';

import { Language } from '../types';

export * from './colors';
export * from './dateTime';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const ENV = Config.ENV;
export const API_URL = Config.API_URL as string;
export const STORE_ENCRYPTION_KEY = Config.STORE_ENCRYPTION_KEY;

// @ts-ignore
export const APP_VERSION = process.env.VERSION;

export const ONE_MINUTE = 1000 * 60;
export const ONE_HOUR = ONE_MINUTE * 60;

export const DEFAULT_LANGUAGE: Language = 'en';

export const LOCATION_PERMISSIONS = Platform.select({
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
});

export const CAMERA_PERMISSIONS = Platform.select({
  android: PERMISSIONS.ANDROID.CAMERA,
  ios: PERMISSIONS.IOS.CAMERA,
});

export const GALLERY_ANDROID_PERMISSIONS = [
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
];

export const GALLERY_IOS_PERMISSIONS = PERMISSIONS.IOS.PHOTO_LIBRARY;

export const GALLERY_PHOTO_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 800,
  maxHeight: 800,
  selectionLimit: 1,
};

export const VIDEO_RECORD_OPTIONS = {
  mediaType: 'video',
  videoQuality: 'high',
  durationLimit: 60,
};

export const PHOTO_TAKE_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.9,
};

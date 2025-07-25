import { Platform, Dimensions } from 'react-native';

import Config from 'react-native-config';
import { getSystemVersion, isTablet } from 'react-native-device-info';
import { CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import { PERMISSIONS } from 'react-native-permissions';

import { Language } from '../types/language';

const { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT } =
  Dimensions.get('window');

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_ANDROID_12_OR_HIGHER =
  IS_ANDROID && (Platform.Version as number) >= 31;
export const IS_ANDROID_13_OR_HIGHER = IS_ANDROID && +getSystemVersion() >= 13;

export const OS_MAJOR_VERSION = parseInt(getSystemVersion(), 10);

export const IS_SMALL_WIDTH_SCREEN = VIEWPORT_WIDTH <= 375;
export const IS_SMALL_HEIGHT_SCREEN = VIEWPORT_HEIGHT <= 720;

export const IS_TABLET = isTablet();

export const ENV = Config.ENV;
export const API_URL = Config.API_URL as string;
export const ONEUP_HEALTH_CLIENT_ID = Config.ONEUP_HEALTH_CLIENT_ID as string;
export const ONEUP_HEALTH_SYSTEM_SEARCH_API_URL =
  Config.ONEUP_HEALTH_SYSTEM_SEARCH_API_URL as string;
export const MIXPANEL_TOKEN = Config.MIXPANEL_TOKEN;

export const STORE_ENCRYPTION_KEY = Config.STORE_ENCRYPTION_KEY;

export const LAUNCHDARKLY_MOBILE_KEY = Config.LAUNCHDARKLY_MOBILE_KEY as string;

/**
 * The scheme and host of the respondent web app in this environment.
 * Format: `https://example.com,https://another-example.com`
 */
export const DEEP_LINK_PREFIXES = (Config.DEEP_LINK_PREFIXES || '')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);

// @ts-ignore
export const APP_VERSION = process.env.VERSION;

export const META_APP_NAME = 'mindlogger-mobile';
export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
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
  quality: 1,
  maxWidth: 800,
  maxHeight: 800,
  selectionLimit: 1,
  presentationStyle: 'fullScreen',
};

export const GALLERY_VIDEO_OPTIONS: ImageLibraryOptions = {
  mediaType: 'video',
  videoQuality: 'high',
  quality: 0.9,
  maxWidth: 800,
  maxHeight: 800,
  presentationStyle: 'fullScreen',
};

export const VIDEO_RECORD_OPTIONS: CameraOptions = {
  mediaType: 'video',
  cameraType: 'back',
  videoQuality: 'high',
  durationLimit: 60,
  quality: 0.9,
  saveToPhotos: false,
  presentationStyle: 'fullScreen',
};

export const PHOTO_TAKE_OPTIONS: CameraOptions = {
  mediaType: 'photo',
  maxWidth: 800,
  maxHeight: 800,
  quality: 1,
  saveToPhotos: false,
  presentationStyle: 'fullScreen',
  assetRepresentationMode: 'auto',
};

export const MICROPHONE_PERMISSIONS = Platform.select({
  android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  ios: PERMISSIONS.IOS.MICROPHONE,
});

export const DAYS_OF_WEEK_NUMBERS = [0, 1, 2, 3, 4, 5, 6];

export const IV_LENGTH = 16;

export { VIEWPORT_WIDTH, VIEWPORT_HEIGHT };

import { Platform } from 'react-native';

import Config from 'react-native-config';

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

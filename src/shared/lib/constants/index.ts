import { Platform } from 'react-native';

import { Language } from '../types';

export * from './colors';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

// @ts-ignore
export const AppVersion = process.env.VERSION;

export const ONE_MINUTE = 1000 * 60;
export const ONE_HOUR = ONE_MINUTE * 60;

export const DEFAULT_LANGUAGE: Language = 'en';

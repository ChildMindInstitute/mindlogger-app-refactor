import { Platform } from 'react-native';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const AppVersion = '0.0.1';

export const ONE_MINUTE = 1000 * 60;
export const ONE_HOUR = ONE_MINUTE * 60;

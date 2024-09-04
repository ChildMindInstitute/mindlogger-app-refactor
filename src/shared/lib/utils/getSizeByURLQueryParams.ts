import { Dimensions } from 'react-native';

import { Logger } from '@shared/lib';

export const getSizeByURLQueryParams = (src: string) => {
  const { width: viewPortWidth } = Dimensions.get('window');
  const contentWidth = viewPortWidth - 100;
  const queryParams = src.split('?')[1];
  let width, height;

  if (!queryParams) {
    Logger.warn(
      `[getSizeByURLQueryParams]: Error extracting query Params from URL`,
    );
    return;
  }

  queryParams.split('&').forEach((param: string) => {
    const [key, value] = param.split('=');
    if (key === 'width') width = Number(value);
    if (key === 'height') height = Number(value);
  });

  if (!width || !height) {
    Logger.warn(
      `[getSizeByURLQueryParams]: Error extracting Width or Height from Query params`,
    );
    return;
  }

  const aspectRatio = height / width;

  return {
    width: width > contentWidth ? contentWidth : width,
    height: width > contentWidth ? contentWidth * aspectRatio : height,
  };
};

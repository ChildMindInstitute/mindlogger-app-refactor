import { colors } from '@shared/lib/constants';

export const invertColor = (hex: string) => {
  const RED_RATIO = 299;
  const GREEN_RATIO = 587;
  const BLUE_RATIO = 114;
  const hexColor = hex.replace('#', '');
  const red = parseInt(hexColor.substring(0, 2), 16);
  const green = parseInt(hexColor.substring(2, 4), 16);
  const blue = parseInt(hexColor.substring(4, 6), 16);
  const yiqColorSpaceValue =
    (red * RED_RATIO + green * GREEN_RATIO + blue * BLUE_RATIO) / 1000;
  return yiqColorSpaceValue >= 128 ? colors.darkerGrey : colors.white;
};

export const uriIsEncoded = (uri: string): boolean => {
  const safeUri = uri || '';

  return safeUri !== decodeURIComponent(safeUri);
};

import { Dimensions } from 'react-native';

type DimensionsInterface = {
  width: number;
  height: number;
};

export const resizeByAspectRatio = ({
  width,
  height,
}: DimensionsInterface): DimensionsInterface => {
  const { width: viewPortWidth } = Dimensions.get('window');
  const contentWidth = viewPortWidth - 20;
  const aspectRatio = height / width;

  return {
    width: width > contentWidth ? contentWidth : width,
    height: width > contentWidth ? contentWidth * aspectRatio : height,
  };
};

import { Dimensions } from 'react-native';

export const calculateMaxHeight = (heightsMap: Map<string, number>): number => {
  const heightsArray = Array.from(heightsMap).map(([_, height]) => height);

  return Math.max(...heightsArray);
};

export const calculateItemsPerRow = (
  cellWidth: number,
  extraSpace: number,
): number => {
  const windowWidth = Dimensions.get('window').width;
  const availableWidth = windowWidth - extraSpace;
  const itemTotalWidth = Math.min(cellWidth + extraSpace, availableWidth);

  const itemsPerRow = Math.floor(availableWidth / itemTotalWidth);

  return itemsPerRow;
};

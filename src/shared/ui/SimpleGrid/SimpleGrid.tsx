import { useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

import { isTablet } from 'react-native-device-info';

import { chunkArray } from '@app/shared/lib/utils/common';

import { GridRow } from './GridRow';
import { GridProps } from './types';
import { calculateItemsPerRow } from './utils';
import { Box } from '../base';

const TABLET_VIEW_EXTRA_MARGIN = 40;

export function SimpleGrid<TItem extends { id: string }>({
  data,
  cellWidth,
  space,

  renderItem,
}: GridProps<TItem>) {
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const extraSpace = space + (isTablet() ? TABLET_VIEW_EXTRA_MARGIN : 0);
  const itemsPerRow = calculateItemsPerRow(cellWidth, extraSpace);

  const rowsData = useMemo(
    () => chunkArray(data, itemsPerRow),
    [data, itemsPerRow],
  );

  return (
    <Box
      space={space}
      flexWrap="wrap"
      opacity={width ? 1 : 0}
      onLayout={onLayout}
    >
      {rowsData.map((rowData, i) => (
        <GridRow
          key={i}
          data={rowData}
          space={space}
          cellWidth={cellWidth}
          renderItem={renderItem}
        />
      ))}
    </Box>
  );
}

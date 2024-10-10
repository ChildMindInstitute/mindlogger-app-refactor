import { useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

import { GridProps } from './types';
import { calculateMaxHeight } from './utils';
import { Box, XStack } from '../base';

export function GridRow<TItem extends { id: string }>({
  data,
  space,
  cellWidth,
  renderItem,
}: GridProps<TItem>) {
  const [itemHeight, setItemHeight] = useState<'auto' | number>('auto');
  const heightsMapRef = useRef<Map<string, number>>(new Map());

  const onItemLayout = (id: string) => {
    return (e: LayoutChangeEvent) => {
      const { height } = e.nativeEvent.layout;
      const heightsMap = heightsMapRef.current;

      if (!heightsMap.has(id)) {
        heightsMap.set(id, height);
      }

      if (heightsMap.size === data.length) {
        setItemHeight(calculateMaxHeight(heightsMap));
      }
    };
  };

  return (
    <XStack space={space}>
      {data.map(item => (
        <Box
          height={itemHeight}
          width={cellWidth}
          key={item.id}
          onLayout={onItemLayout(item.id)}
        >
          {renderItem(item)}
        </Box>
      ))}
    </XStack>
  );
}

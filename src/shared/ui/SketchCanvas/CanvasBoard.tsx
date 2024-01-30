import {
  Dispatch,
  forwardRef,
  memo,
  SetStateAction,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';

import { Canvas, Group, Path, SkPath } from '@shopify/react-native-skia';

export type CanvasBoardRef = {
  setPaths: Dispatch<SetStateAction<SkPath[]>>;
};

type Props = {
  size: number;
};

const CanvasBoard = forwardRef<CanvasBoardRef, Props>(({ size }, ref) => {
  const [paths, setPaths] = useState<Array<SkPath>>([]);

  const styles = useMemo(
    () =>
      StyleSheet.flatten({
        width: size,
        height: size,
      }),
    [size],
  );

  useImperativeHandle(ref, () => {
    return {
      setPaths,
    };
  });

  const drawnPaths = [...paths];
  const activePath = drawnPaths.pop();

  return (
    <Canvas style={styles}>
      <Group>
        <DrawnPaths paths={drawnPaths} />

        {activePath && (
          <Path
            path={activePath}
            strokeWidth={1.5}
            color="black"
            style="stroke"
          />
        )}
      </Group>
    </Canvas>
  );
});

type DrawnPathsProps = {
  paths: Array<SkPath>;
};

const DrawnPaths = memo(
  ({ paths }: DrawnPathsProps) => (
    <>
      {paths.map((path, i) => (
        <Path
          key={i}
          path={path}
          strokeWidth={1.5}
          color="black"
          style="stroke"
        />
      ))}
    </>
  ),
  (prevProps, nextProps) => prevProps.paths.length === nextProps.paths.length,
);

export default memo(CanvasBoard);

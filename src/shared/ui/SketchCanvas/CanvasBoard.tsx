import {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';

import { Canvas, Group, Path, Skia, SkPath } from '@shopify/react-native-skia';
import { useSharedValue } from 'react-native-reanimated';

export type CanvasBoardRef = {
  addPath: (path: SkPath) => void;
  changeLastPath: (callback: (prevPath: SkPath) => SkPath) => void;
  clear: () => void;
  initialize: (paths: SkPath[]) => void;
};

type Props = {
  size: number;
};

const CanvasBoard = forwardRef<CanvasBoardRef, Props>(({ size }, ref) => {
  const [paths, setPaths] = useState<Array<SkPath>>([]);

  const activePath = useSharedValue<SkPath>(Skia.Path.Make());

  const styles = useMemo(
    () =>
      StyleSheet.flatten({
        width: size,
        height: size,
      }),
    [size],
  );

  useImperativeHandle(ref, () => ({
    addPath: (path: SkPath) => {
      const activePathValue = activePath.value;

      if (activePathValue) {
        setPaths(prevPaths => [...prevPaths, activePathValue]);
      }

      activePath.value = path;
    },
    changeLastPath: (callback: (prevPath: SkPath) => SkPath) => {
      activePath.value = callback(paths[paths.length - 1]);
    },
    clear: () => {
      setPaths([]);
      activePath.value = Skia.Path.Make();
    },
    initialize: (initialPaths: SkPath[]) => {
      setPaths(initialPaths);
      activePath.value = Skia.Path.Make();
    },
  }));

  return (
    <Canvas style={styles}>
      <Group>
        <DrawnPaths paths={paths} />

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

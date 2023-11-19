import { useMemo, forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet } from 'react-native';

import { SkPath, Canvas, Group, Path } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useCallbacksRefs } from '@app/shared/lib';

import LineSketcher, { Point } from './LineSketcher';

export type SketchCanvasRef = {
  clear: () => void;
};

type Props = {
  initialLines: Array<Point[]>;
  width: number;
  onStrokeStart: (x: number, y: number) => void;
  onStrokeChanged: (x: number, y: number) => void;
  onStrokeEnd: () => void;
};

const SketchCanvas = forwardRef<SketchCanvasRef, Props>((props, ref) => {
  const { initialLines, width, onStrokeStart, onStrokeChanged, onStrokeEnd } =
    props;

  const [paths, setPaths] = useState<Array<SkPath>>(() =>
    initialLines.map(points => LineSketcher.createPathFromPoints(points)),
  );

  const callbacksRef = useCallbacksRefs({
    onStrokeStart,
    onStrokeChanged,
    onStrokeEnd,
  });

  const lineSketcher = useMemo(() => new LineSketcher(), []);

  useImperativeHandle(ref, () => {
    return {
      clear() {
        setPaths([]);
      },
    };
  });

  const styles = useMemo(
    () =>
      StyleSheet.flatten({
        width: width,
        height: width,
      }),
    [width],
  );

  const panResponder = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(e => {
          const point: Point = {
            x: e.x,
            y: e.y,
          };

          const path = lineSketcher.createLine(point);

          setPaths(currentPaths => [...currentPaths, path]);
          callbacksRef.current.onStrokeStart(point.x, point.y);
        })
        .onChange(e => {
          const point: Point = {
            x: e.x,
            y: e.y,
          };

          callbacksRef.current.onStrokeChanged(point.x, point.y);

          setPaths(currentPaths => {
            const lastPath = currentPaths[currentPaths.length - 1];

            lineSketcher.progressLine(lastPath, point);

            return [...currentPaths.slice(0, -1), lastPath];
          });
        })
        .onEnd(() => {
          callbacksRef.current.onStrokeEnd();
        })
        .runOnJS(true),
    [lineSketcher, callbacksRef],
  );

  return (
    <GestureDetector gesture={panResponder}>
      <Canvas style={styles}>
        <Group>
          {paths.map((path, i) => (
            <Path
              key={i}
              path={path}
              strokeWidth={1.5}
              color="black"
              style="stroke"
            />
          ))}
        </Group>
      </Canvas>
    </GestureDetector>
  );
});

export default SketchCanvas;

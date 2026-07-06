import { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';

import { Canvas, Path, Skia, SkPath } from '@shopify/react-native-skia';
import { useSharedValue } from 'react-native-reanimated';

import { DrawingLayer } from './DrawingLayer';
import { createPathFromPoints, Point } from './LineSketcher';

export type SketchCanvasRef = {
  clear: () => void;
};

type Props = {
  initialLines: Array<Point[]>;
  enabled?: boolean;
  onStrokeStart: (x: number, y: number, time: number) => void;
  onStrokeChanged: (x: number, y: number, time: number) => void;
  onStrokeEnd: (x: number, y: number, time: number) => void;
};

export const SketchCanvas = forwardRef<SketchCanvasRef, Props>((props, ref) => {
  const {
    initialLines,
    enabled = true,
    onStrokeStart,
    onStrokeChanged,
    onStrokeEnd,
  } = props;

  const fullPath = useSharedValue<SkPath>(
    initialLines
      .map(points => createPathFromPoints(points))
      .reduce((path, curr) => path.addPath(curr), Skia.Path.Make()),
  );

  const width = useSharedValue(0);

  useImperativeHandle(ref, () => {
    return {
      clear() {
        fullPath.value = Skia.Path.Make();
      },
    };
  });

  return (
    <View
      style={styles.canvas}
      onLayout={e => (width.value = e.nativeEvent.layout.width)}
    >
      {/*
        Always mounted: keeping the Skia Canvas alive avoids the GLSurface
        re-initialisation that flashes (flickers) on Android when it is
        unmounted/remounted (regression introduced by the Skia 2.4.x upgrade).
      */}
      <Canvas style={StyleSheet.absoluteFill}>
        <Path path={fullPath} strokeWidth={1.5} color="black" style="stroke" />
      </Canvas>

      {/*
        Conditionally mounted: unmounting the gesture layer on every hide/show
        cycle gives the next stroke a fully reset RNGH handler + gesture state,
        which is what prevents free-drawing, multitouch and stale start points.
      */}
      {enabled && (
        <DrawingLayer
          fullPath={fullPath}
          width={width}
          onStrokeStart={onStrokeStart}
          onStrokeChanged={onStrokeChanged}
          onStrokeEnd={onStrokeEnd}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});

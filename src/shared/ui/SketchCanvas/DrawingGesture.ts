import { Gesture, TouchData } from 'react-native-gesture-handler';
import { runOnJS, SharedValue } from 'react-native-reanimated';

import { IS_IOS } from '@app/shared/lib';

import { Point } from './LineSketcher';

type Refs = {
  currentTouchIdRef: SharedValue<number | null>;
  sizeRef: SharedValue<number>;
};

type Callbacks = {
  onTouchStart: (touchInfo: Point, time: number) => void;
  onTouchProgress: (
    touchInfo: Point,
    straightLine: boolean,
    time: number,
  ) => void;
  onTouchEnd: () => void;
};

function DrawingGesture(
  { currentTouchIdRef, sizeRef }: Refs,
  { onTouchStart, onTouchProgress, onTouchEnd }: Callbacks,
) {
  const isOutOfCanvas = (point: Point) => {
    'worklet';
    return (
      point.x > sizeRef.value ||
      point.y > sizeRef.value ||
      point.x < 0 ||
      point.y < 0
    );
  };

  const normalizeCoordinates = (
    touchData: TouchData,
    deviation: number = 0,
  ): TouchData => {
    'worklet';
    const normalize = (value: number) => {
      if (value < 0) {
        return 0 + deviation;
      }

      if (value > sizeRef.value) {
        return sizeRef.value - deviation;
      }

      return value;
    };

    return {
      ...touchData,
      x: normalize(touchData.x),
      y: normalize(touchData.y),
    };
  };

  const androidPanGesture = () =>
    Gesture.Pan()
      .manualActivation(true)
      .onTouchesDown((event, stateManager) => {
        if (event.numberOfTouches === 1) {
          const touchId = event.allTouches[0].id;

          currentTouchIdRef.value = touchId;
          stateManager.activate();
        }
      })
      .onTouchesUp((event, stateManager) => {
        const shouldEndGesture = event.changedTouches.some(
          touchData => touchData.id === currentTouchIdRef.value,
        );

        if (shouldEndGesture) {
          stateManager.end();
          currentTouchIdRef.value = null;
        }
      })
      .onStart(event => {
        runOnJS(onTouchStart)(event, Date.now());
      })
      .onTouchesMove((event, manager) => {
        const touchData = event.allTouches[0];
        const time = Date.now();

        if (isOutOfCanvas(touchData)) {
          const finalPoint = normalizeCoordinates(touchData);

          runOnJS(onTouchProgress)(finalPoint, true, time);

          manager.end();
        } else {
          runOnJS(onTouchProgress)(touchData, false, time);
        }
      })
      .onEnd(() => {
        runOnJS(onTouchEnd)();
      });

  const iosPanGesture = () =>
    Gesture.Pan()
      .maxPointers(1)
      .onStart(event => {
        const time = Date.now();

        runOnJS(onTouchStart)(event, time);
      })
      .onTouchesMove((event, manager) => {
        const touchData = event.allTouches[0];
        const time = Date.now();

        if (isOutOfCanvas(touchData)) {
          const finalPoint = normalizeCoordinates(touchData);

          runOnJS(onTouchProgress)(finalPoint, true, time);

          manager.end();
        } else {
          manager.activate();
        }
      })
      .onUpdate(event => {
        const time = Date.now();

        runOnJS(onTouchProgress)(event, false, time);
      })
      .onEnd(() => {
        runOnJS(onTouchEnd)();
      });

  const tapGesture = () =>
    Gesture.Tap()
      .onStart(event => {
        runOnJS(onTouchStart)(event, Date.now());
      })
      .onEnd(() => {
        runOnJS(onTouchEnd)();
      });

  const longTapGesture = () =>
    Gesture.LongPress()
      .onStart(event => {
        runOnJS(onTouchStart)(event, Date.now());
      })
      .onEnd(() => {
        runOnJS(onTouchEnd)();
      });

  const iosGesture = () =>
    Gesture.Exclusive(iosPanGesture(), tapGesture(), longTapGesture());

  const androidGesture = () =>
    Gesture.Exclusive(androidPanGesture(), tapGesture(), longTapGesture());

  const gesture = IS_IOS ? iosGesture() : androidGesture();

  return gesture;
}

export default DrawingGesture;

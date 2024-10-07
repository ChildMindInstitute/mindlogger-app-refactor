import {
  Gesture,
  TouchData,
  State as EventState,
  GestureTouchEvent,
} from 'react-native-gesture-handler';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

import { IS_IOS } from '@app/shared/lib/constants';

import { Point } from './LineSketcher';

type Options = {
  areaSize: SharedValue<number>;
};

type Callbacks = {
  onTouchStart: (touchInfo: Point, time: number) => void;
  onTouchProgress: (
    touchInfo: Point,
    straightLine: boolean,
    time: number,
  ) => void;
  onTouchEnd: (touchInfo: Point, time: number) => void;
};

const findTouchById = (event: GestureTouchEvent, id?: number) => {
  'worklet';
  return event.changedTouches.find(touchData => touchData.id === id);
};

export function useDrawingGesture(
  { areaSize }: Options,
  { onTouchStart, onTouchProgress, onTouchEnd }: Callbacks,
) {
  const registeredTouch = useSharedValue<TouchData | null>(null);
  const isTapEvent = useSharedValue(false);
  const currentTouchIdRef = useSharedValue<number | null>(null);

  const isOutOfCanvas = (point: Point) => {
    'worklet';
    return (
      point.x > areaSize.value ||
      point.y > areaSize.value ||
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

      if (value > areaSize.value) {
        return areaSize.value - deviation;
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
        onTouchStart(event, Date.now());
      })
      .onTouchesMove((event, manager) => {
        const touchData = event.allTouches[0];
        const time = Date.now();

        if (isOutOfCanvas(touchData)) {
          const finalPoint = normalizeCoordinates(touchData);

          onTouchProgress(finalPoint, true, time);

          manager.end();
        } else {
          onTouchProgress(touchData, false, time);
        }
      })
      .onEnd(event => {
        onTouchEnd(event, Date.now());
      });

  const iosManualGesture = () =>
    Gesture.Manual()
      .manualActivation(true)
      /** Calls onTouchesCancelled when gesture is outside of it's area */
      .shouldCancelWhenOutside(true)
      .onTouchesDown(event => {
        const shouldRegisterTouch =
          event.numberOfTouches === 1 &&
          !registeredTouch.value &&
          event.state === EventState.BEGAN;

        if (shouldRegisterTouch) {
          registeredTouch.value = event.allTouches[0];
        }
      })
      .onBegin(() => {
        if (!registeredTouch.value) {
          return;
        }

        /**
         * When a simple Tap gesture happens onStart and onEnd are not called.
         * Hence, it is necessary to mark it here and then handle on onFinalize.
         */
        isTapEvent.value = true;

        const time = Date.now();

        onTouchStart(registeredTouch.value, time);
      })
      .onStart(() => {
        if (!registeredTouch.value) {
          return;
        }

        /**
         * When onStart is called it means that a Pan gesture is taking place.
         * Therefore, we need to set isTapEvent back to false.
         */
        isTapEvent.value = false;
      })
      .onTouchesMove((event, manager) => {
        /**
         * Here, we need to activate only the registered touch.
         * When it gets activated onUpdate is called.
         */
        const touchData = findTouchById(event, registeredTouch.value?.id);

        if (!touchData) {
          return;
        }

        registeredTouch.value = touchData;
        manager.activate();
      })
      .onUpdate(() => {
        if (!registeredTouch.value) {
          return;
        }

        onTouchProgress(registeredTouch.value, false, Date.now());
      })
      .onTouchesUp((event, manager) => {
        /**
         * Here, we need to call .end() only the registered touch.
         * After that, onEnd is called.
         */
        const touchData = findTouchById(event, registeredTouch.value?.id);

        if (touchData) {
          registeredTouch.value = touchData;
          manager.end();
        }
      })
      .onEnd(() => {
        if (!registeredTouch.value) {
          return;
        }

        onTouchEnd(registeredTouch.value, Date.now());
      })
      /**
       * onTouchesCancelled is called when the gesture has ended or was interrupted.
       * It is decided by the RNGH's implementation using UIGestureRecognizers and
       * shouldCancelWhenOutside(true) flag.
       */
      .onTouchesCancelled((event, manager) => {
        const touchData = findTouchById(event, registeredTouch.value?.id);

        const shouldFail =
          touchData &&
          event.state === EventState.ACTIVE &&
          registeredTouch.value;

        if (shouldFail && isOutOfCanvas(touchData)) {
          const finalPoint = normalizeCoordinates(touchData);

          registeredTouch.value = finalPoint;

          onTouchProgress(finalPoint, true, Date.now());
        }

        if (shouldFail) {
          manager.fail();
        }
      })
      .onFinalize(() => {
        if (isTapEvent.value && registeredTouch.value) {
          onTouchEnd(registeredTouch.value, Date.now());
        }

        isTapEvent.value = false;
        registeredTouch.value = null;
      });

  const tapGesture = () =>
    Gesture.Tap()
      .onStart(event => {
        onTouchStart(event, Date.now());
      })
      .onEnd(event => {
        onTouchEnd(event, Date.now());
      });

  const longTapGesture = () =>
    Gesture.LongPress()
      .onStart(event => {
        onTouchStart(event, Date.now());
      })
      .onEnd(event => {
        onTouchEnd(event, Date.now());
      });

  const iosGesture = () => iosManualGesture();

  const androidGesture = () =>
    Gesture.Exclusive(androidPanGesture(), tapGesture(), longTapGesture());

  const gesture = IS_IOS ? iosGesture() : androidGesture();

  return gesture;
}

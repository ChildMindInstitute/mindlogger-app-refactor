import { useEffect, useRef } from 'react';

import { TASK_LOOP_RATE } from '../constants';

const useAnimation = (
  callback: (a: number, b: number, c: number) => void,
  running = false,
) => {
  const animation = useRef<number | undefined>();
  const startTime = useRef(performance.now());
  const previousTime = useRef(performance.now());
  const tickNumber = useRef(1);

  const animate = (timeStamp: number) => {
    const timeElapsed = timeStamp - startTime.current;
    const newTick = Math.round(timeElapsed / (TASK_LOOP_RATE * 1000));

    if (newTick > tickNumber.current) {
      tickNumber.current = newTick;
      callback(
        timeElapsed,
        tickNumber.current,
        timeStamp - previousTime.current,
      );
      previousTime.current = timeStamp;
    }

    animation.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (running) {
      previousTime.current = performance.now();
      startTime.current = performance.now();

      animation.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animation.current as number);
    }

    return () => {
      cancelAnimationFrame(animation.current as number);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);
};

export default useAnimation;
